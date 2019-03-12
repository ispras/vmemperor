import pathlib

import constants
from handlers.rest.base import RESTHandler


class Postinst(RESTHandler):
    def get(self):
        os = self.get_argument("os")
        device = self.get_argument("device")
        pubkey_path = pathlib.Path(constants.ansible_pubkey)
        pubkey = pubkey_path.read_text()
        self.render(f'templates/installation-scenarios/postinst/{os}', pubkey=pubkey, device=device)