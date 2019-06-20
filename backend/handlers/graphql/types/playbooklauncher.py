import asyncio
import json
import logging
import os
import pathlib
import shutil
import subprocess
import tempfile
import uuid
from pathlib import Path
from typing import Optional, Dict, List, Any

import graphene
import tornado.ioloop
from sentry_sdk import capture_exception

import constants
import constants.re as re
from authentication import with_default_authentication
from connman import ReDBConnection
from customtask.customtask import CustomTask
from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.resolvers import with_connection
from loggable import Loggable
from playbookloader import PlaybookLoader
from xenadapter import VIF
from xenadapter.network import Network
from xenadapter.vm import VM
from rethinkdb import RethinkDB
from tornado.options import options as opts
import ruamel.yaml

def launch_playbook(ctx: ContextProtocol,  task : CustomTask, playbook_id, vms: Optional[List], variables: Optional[Dict[str, Any]]):
    with ReDBConnection().get_connection():
        yaml = ruamel.yaml.YAML()


        task.set_name_description(json.dumps({
            "playbookId": playbook_id,
            "variables": variables
        }))
        def check_access(vm):
            if not vm.check_access(ctx.user_authenticator, VM.Actions.launch_playbook):
                task.set_status(status='failure', error_info_add=f"Access denied: user: users/{ctx.user_authenticator.get_id()}")
                return False
            else:
                return True
        if vms:
            vms = list(filter(lambda ref: check_access(VM(xen=ctx.xen, ref=ref)), vms))
        else:
            vms = []
        temp_dir = constants.tmpdir_path + task.id
        try:
            table = re.db.table(PlaybookLoader.PLAYBOOK_TABLE_NAME)
            playbook = table.get(playbook_id).run()
            try:
                pathlib.Path(temp_dir).mkdir(parents=True)
            except OSError as e:
                task.set_status(status='failure', error_info_add=f"Cannot create temporary directory {temp_dir}: {str(e)}")
                return

            from distutils.dir_util import copy_tree
            playbook_dir = playbook['playbook_dir']
            logging.debug(f"Copying {playbook_dir} into temporary directory")
            try:
                copy_tree(playbook_dir, temp_dir)
            except Exception as e:
                task.set_status(status='failure', error_info_add=f"Cannot copy {playbook_dir} into {temp_dir}: {str(e)}")
                return

            temp_path = Path(temp_dir)

            if not playbook['inventory']:
                hosts_file = 'hosts'
                yaml_hosts = {'all': {'hosts': {}}}
                for ref in vms:
                    vm = VM(ctx.xen, ref=ref)
                    for vif_ref in vm.get_VIFs():
                        vif = VIF(ctx.xen, ref=vif_ref)
                        network = Network(ctx.xen, ref=vif.get_network())
                        if not network:
                            continue

                        if network and network.get_uuid() not in opts.ansible_networks and network.ref not in opts.ansible_networks:
                            logging.debug(f"{network} is not a network configured for Ansible. This is probably okay")
                            continue
                        ip = vif.get_ipv4()
                        if not ip:
                            logging.warning(f"Could not get an IP to connect to {vm}: {network}. This is probably not okay, install Xen drivers")
                            continue

                        other_config = vm.get_other_config()
                        user = other_config.get('first_user', 'root')
                        yaml_hosts['all']['hosts'][vm.get_name_label()] = {
                            'ansible_user': user,
                            'ansible_host': ip
                        }
                        break
                    else:
                        logging.warning(
                            f"Ignoring {vm}: not connected to any of 'ansible_networks'. Check your configuration")
                        task.set_status(status="failure", error_info_add=f"Could not connect to {vm}: Not connected to Ansible network")
                if yaml_hosts['all']['hosts']:
                    # Create ansible execution task
                    with open(temp_path.joinpath(hosts_file), 'w') as file:
                        yaml.dump(yaml_hosts, file)
                        logging.debug(f"Hosts file created at {file.name}")
                else:
                    logging.error(f"No suitable VMs found")
                    return
            else:
                hosts_file = playbook['inventory']

            logging.debug("Patching variables files...")
            for location in playbook['variables_locations']:
                this_variables = {}
                for variable in playbook['variables_locations'][location]:
                    value = variables.get(variable, playbook['variables'][variable]['value'])
                    this_variables[variable] = value
                file_name = temp_path.joinpath(location, 'all')
                if this_variables:
                    logging.debug(f"Loading file {file_name}")
                    with open(file_name, 'r') as file:
                        original_variables = yaml.load(file)
                    with open(file_name, 'w') as file:
                        yaml.dump({**original_variables, **this_variables}, file)

                    logging.info(f'File {file_name} patched')

            cmd_line = [opts.ansible_playbook, '-i', hosts_file, playbook['playbook']]
            cwd = temp_path

            log_path = Path(opts.ansible_logs).joinpath(task.id)
            os.makedirs(log_path)
            with open(log_path.joinpath('stdout'), 'w') as _stdout:
                with open(log_path.joinpath('stderr'), 'w') as _stderr:

                    logging.debug(f"Running {cmd_line} in {cwd}. Log path: {log_path}")

                    p = subprocess.Popen(cmd_line,
                                         cwd=cwd, stdout=_stdout, stderr=_stderr,
                                         env={"ANSIBLE_HOST_KEY_CHECKING": "False"})
                    def cancel():
                        p.kill()

                    task.set_cancel_handler(cancel)
                    task.set_status(progress=0.2)
                    p.wait()
                    task.set_status(status='success' if p.returncode == 0 else 'failure',
                                    result=p.returncode,
                                    error_info_add=None if p.returncode == 0 else f"ansible-playbook exited with code {p.returncode}",
                                    progress=1)

                    logging.info(f'Finished with return code {p.returncode}. Logs are available in {log_path}')
        except Exception as e:
            excString = str(e).replace('\n', ' ')
            task.set_status(status="failure", error_info_add=excString)
            logging.error(f"Exception: {excString}")
            capture_exception(e)

        finally:
            shutil.rmtree(temp_dir, ignore_errors=True)


class PlaybookLaunchMutation(graphene.Mutation):
    task_id = graphene.ID(required=True, description="Playbook execution task ID")

    class Arguments:
        id = graphene.Argument(graphene.ID, required=True, description="Playbook ID")
        vms = graphene.Argument(graphene.List(graphene.ID),
                                description="VM UUIDs to run Playbook on. Ignored if this is a Playbook with provided Inventory")

        variables = graphene.Argument(graphene.JSONString,
                                      description="JSON with key-value pairs representing Playbook variables changed by user")

    @staticmethod
    @with_default_authentication
    @with_connection
    def mutate(root, info, id, vms=None, variables=None):
        '''
        Lauch a specified playbooks
        :param root:
        :param info:
        :param id: Playbook to launch
        :param vms: VM refs to launch playbook on. If None, don't generate an inventory file
        :param variables:
        :return:
        '''
        ctx : ContextProtocol = info.context
        table = re.db.table(PlaybookLoader.PLAYBOOK_TABLE_NAME)
        data = table.get(id).pluck('id').coerce_to('array').run()
        if not data:
            raise ValueError(f"No such playbook: {id}")
        task_id = str(uuid.uuid4())
        task = CustomTask(id=task_id, object_type=VM, object_ref=';'.join(vms), action=VM.Actions.launch_playbook.serialize()[0], user_authenticator=ctx.user_authenticator)
        tornado.ioloop.IOLoop.current().run_in_executor(ctx.executor,
                                                        lambda: launch_playbook(ctx, task, id, vms, variables))


        return PlaybookLaunchMutation(task_id=task_id)
