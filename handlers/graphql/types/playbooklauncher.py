import os
import shutil
import subprocess
import tempfile
import uuid
from pathlib import Path
from typing import Optional, Dict, List, Any

import graphene
import tornado.ioloop
import constants.re as re
from authentication import with_default_authentication
from connman import ReDBConnection
from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.resolvers import with_connection
from handlers.graphql.types.tasks.playbook import PlaybookTaskList, PlaybookTask, PlaybookTaskState
from loggable import Loggable
from playbookloader import PlaybookLoader
from xenadapter.network import Network
from xenadapter.vm import VM
from rethinkdb import RethinkDB
from tornado.options import options as opts
import ruamel.yaml

def launch_playbook(ctx: ContextProtocol, task_id, playbook_id, vms: Optional[List], variables: Optional[Dict[str, Any]]):
    with ReDBConnection().get_connection():
        r = RethinkDB()
        class LaunchPlaybook(Loggable):
            """
            This class is used to provide logger for launch_playbook
            """
            task_list : PlaybookTaskList

            def __init__(self):
                self.task_list = PlaybookTaskList()
                self.init_log()

            def __repr__(self):
                return f'PlaybookLauncher <{task_id} ({playbook_id})>'
        launcher = LaunchPlaybook()
        log = launcher.log
        yaml = ruamel.yaml.YAML()


        log.debug("Checking access rights for VMs")
        def check_access(ref):
            _vm = VM(ctx.xen, ref)
            if not _vm.check_access("playbook"):
                launcher.task_list.upsert_task(ctx.user_authenticator.get_id(), PlaybookTask(
                    id=task_id, playbook_id=playbook_id, state=PlaybookTaskState.Error,
                    message=f"VM {_vm}: Access denied (for playbook launcher). Needs 'playbook' access"))
                return
        if vms:
            vms = list(filter(check_access, vms))
        else:
            vms = []
        try:
            table = re.db(opts.database).table(PlaybookLoader.PLAYBOOK_TABLE_NAME)
            playbook = table.get(playbook_id).run()

            temp_dir = tempfile.mkdtemp(prefix='vmemperor-playbook', suffix=playbook_id)
            log.debug(f"Creating temporary directory {temp_dir}")
            from distutils.dir_util import copy_tree
            playbook_dir = playbook['playbook_dir']
            log.debug(f"Copying {playbook_dir} into temporary directory")
            copy_tree(playbook_dir, temp_dir)
            temp_path = Path(temp_dir)
            vms_table = re.db(opts.database).table('vms')
            documents = vms_table.get_all(*vms).coerce_to('array').run()

            if not playbook['inventory']:
                hosts_file = 'hosts'
                yaml_hosts = {'all': {'hosts': {}}}
                for vm in documents:
                    for interface in vm['interfaces'].values():
                        network = Network(ctx.user_authenticator.get_id(), ref=interface['network'])
                        if network.get_uuid() not in opts.ansible_networks:
                            log.debug(f"{network} is not a network configured for Ansible. This is probably okay")
                            continue
                        if not 'ip' in interface or not interface['ip']:
                            log.warning(f"Could not get an IP to connect to VM {vm['uuid']}: {network}. This is probably not okay, install Xen drivers")
                            continue
                        yaml_hosts['all']['hosts'][vm['name_label']] = {
                            'ansible_user': 'root',
                            'ansible_host': interface['ip']
                        }
                        break
                    else:
                        log.warning(
                            f"Ignoring VM {vm['uuid']}: not connected to any of 'ansible_networks'. Check your configuration")
                        launcher.task_list.upsert_task(ctx.user_authenticator.get_id(), PlaybookTask(
                            id=task_id, playbook_id=playbook_id, state=PlaybookTaskState.ConfigurationWarning,
                            message=f"Could not connect to VM {vm['uuid']}: Not connected to Ansible network")
                        )

                if yaml_hosts['all']['hosts']:
                    # Create ansible execution task
                    with open(temp_path.joinpath(hosts_file), 'w') as file:
                        yaml.dump(yaml_hosts, file)
                        log.debug(f"Hosts file created at {file.name}")
                else:
                    log.error(f"No suitable VMs found")
                    shutil.rmtree(temp_dir, ignore_errors=True)
                    return
            else:
                hosts_file = playbook['inventory']

            log.debug("Patching variables files...")
            for location in playbook['variables_locations']:
                this_variables = {}
                for variable in playbook['variables_locations'][location]:
                    value = variables.get(variable, playbook['variables'][variable]['value'])
                    this_variables[variable] = value
                file_name = temp_path.joinpath(location, 'all')
                if this_variables:
                    log.debug(f"Loading file {file_name}")
                    with open(file_name, 'r') as file:
                        original_variables = yaml.load(file)
                    with open(file_name, 'w') as file:
                        yaml.dump({**original_variables, **this_variables}, file)

                    log.info(f'File {file_name} patched')

            cmd_line = [opts.ansible_playbook, '-i', hosts_file, playbook['playbook']]
            cwd = temp_path

            log_path = Path(opts.ansible_logs).joinpath(cwd.name)
            os.makedirs(log_path)
            with open(log_path.joinpath('stdout'), 'w') as _stdout:
                with open(log_path.joinpath('stderr'), 'w') as _stderr:

                    log.debug(f"Running {cmd_line} in {cwd}. Log path: {log_path}")
                    launcher.task_list.upsert_task(ctx.user_authenticator.get_id(), PlaybookTask(id=task_id, playbook_id=playbook_id,
                                                                                        state=PlaybookTaskState.Running,
                                                                                        message=f"Task is currently running"))
                    proc = subprocess.run(cmd_line,
                                             cwd=cwd, stdout=_stdout, stderr=_stderr,
                                             env={"ANSIBLE_HOST_KEY_CHECKING": "False"})

                    return_code = proc.returncode
                    launcher.task_list.upsert_task(ctx.user_authenticator.get_id(),
                                                   PlaybookTask(id=task_id, playbook_id=playbook_id,
                                                                state=PlaybookTaskState.Finished if return_code == 0 else PlaybookTaskState.Error,
                                                                message=f"Task is finished with exit code {return_code}"))

            log.info(f'Finished with return code {return_code}. Logs are available in {log_path}')
        except Exception as e:
            excString = str(e).replace('\n', ' ')
            launcher.task_list.upsert_task(ctx.user_authenticator.get_id(),
                                           PlaybookTask(id=task_id, playbook_id=playbook_id, state=PlaybookTaskState.Error,
                                                        message=f"Exception: {excString}"))
            log.error(f"Exception: {excString}")

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
        table = re.db(opts.database).table(PlaybookLoader.PLAYBOOK_TABLE_NAME)
        data = table.get(id).pluck('id').coerce_to('array').run()
        if not data:
            raise ValueError(f"No such playbook: {id}")
        task_id = str(uuid.uuid4())
        task_list = PlaybookTaskList()
        task_list.upsert_task(ctx.user_authenticator.get_id(), PlaybookTask(
            id=task_id, playbook_id=id, state=PlaybookTaskState.Preparing, message=""))
        tornado.ioloop.IOLoop.current().run_in_executor(ctx.executor,
                                                        lambda: launch_playbook(ctx, task_id, id, vms, variables))

        return PlaybookLaunchMutation(task_id=task_id)
