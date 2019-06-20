import pathlib
from os import path
import sys
import constants
from handlers.rest.base import RESTHandler


class Postinst(RESTHandler):
    def get(self):
        os = self.get_argument("os")
        device = self.get_argument("device")
        username = self.get_argument('username')
        pubkey_path = pathlib.Path(constants.ansible_pubkey)
        pubkey = pubkey_path.read_text()
        self.render(path.join(
            path.abspath(sys.modules['__main__'].__file__ + "/.."),
            f'templates/installation-scenarios/postinst/{os}'), pubkey=pubkey, device=device, username=username)

