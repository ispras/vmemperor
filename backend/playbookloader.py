from ruamel import yaml
from pathlib import Path, PurePath
import json
from loggable import Loggable
import traceback

class PlaybookLoader (Loggable):
    """
    This class is used for loading playbooks into rethinkdb
    """
    _PLAYBOOK_VMEMPEROR_CONF : str = 'vmemperor.conf'
    PLAYBOOK_TABLE_NAME: str ='playbooks'

    _DEFAULT_CONFIG = {
        "inventory": None,
        "single": False,
    }


    @staticmethod
    def load_playbooks():
        from tornado.options import options as opts
        directory = Path(opts.ansible_dir)
        for item in directory.iterdir():
            PlaybookLoader(item)

    def __repr__(self):
        return "PlaybookLoader"

    def __init__(self, playbook_name):
        from tornado.options import options as opts
        self.init_log()

        playbook_dir = Path(playbook_name)
        playbook_name = playbook_dir.name
        self.log.debug(f"Loading playbook {playbook_name} from {playbook_dir}")

        from rethinkdb import RethinkDB
        r = RethinkDB()

        try:
            if not playbook_dir.is_dir():
                raise ValueError(f'"{playbook_dir.absolute()}" does not exist or not a directory!')

            config_file = playbook_dir.joinpath(self._PLAYBOOK_VMEMPEROR_CONF)
            if not config_file.is_file():
                raise ValueError(f'"{config_file.absolute()}" does not exist or not a file!')

            with open(config_file) as file:
                config_dict = yaml.safe_load(file)

                self.config = config_dict

            # Fill optional config parameters
            for k,v  in self._DEFAULT_CONFIG.items():
                if k not in self.config:
                    self.config[k] = v


            # Find variables
            keys = self.config['variables'].keys()
            self.variables_locations = {}
            self.vars = {}
            for var in ('host_vars', 'group_vars'):
                self.variables_locations[var] = []
                host_vars_file = playbook_dir.joinpath(var, 'all')
                if not host_vars_file.is_file():
                    continue
                with open(host_vars_file) as file:
                    host_vars = yaml.safe_load(file)

                self.vars[var] = host_vars
                for key in keys:
                    try:
                        self.config['variables'][key] = {**self.config['variables'][key],
                        **{'value': host_vars[key]}}
                        self.variables_locations[var].append(key)
                    except KeyError:
                        continue

            # Check if playbook file exists
            playbook_file = playbook_dir.joinpath(self.config['playbook'])
            if not playbook_file.is_file():
                raise ValueError(f"Playbook file {playbook_file.absolute()} does not exist")


            self.config['playbook_dir'] = str(playbook_dir.absolute())
            self.config['id'] = playbook_dir.name
            self.config['variables_locations'] = self.variables_locations

            table = r.db(opts.database).table(self.PLAYBOOK_TABLE_NAME)
            table.insert(self.config).run()
            self.log.debug(f"Loaded playbook {self.config['id']}")
        except Exception as e:
            self.log.error(f"Exception: {e} at {traceback.print_exc()}")




    def get_name(self):
        return self.config['name']

    def get_requires(self):
        return self.config['requires']

    def get_playbook_file(self):
        '''
        This is relative path to playbook file
        :return:
        '''
        return self.config['playbook']

    def get_description(self):
        return self.config.get('description', '')

    def get_playbook_dir(self):
        return self.config['playbook_dir']

    def get_config(self):
        return self.config

    def get_variables(self):
        return self.config['variables']

    def get_id(self):
        return self.config['id']

    def get_variables_locations(self):
        return self.variables_locations

    def get_single(self):
        return self.config['single']

    def get_inventory(self):
        return self.config['inventory']



class PlaybookEncoder(json.JSONEncoder):
    _OMIT_KEYS = ['playbook', 'playbook_dir']
    def default(self, o):
        if isinstance(o, PlaybookLoader):
            return {k:v for k, v in o.get_config().items() if k not in self._OMIT_KEYS}
        if isinstance(o, PurePath):
            return str(o)
        return super().default(o)






