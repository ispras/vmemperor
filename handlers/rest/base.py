import json
import pickle

from tornado.options import options as opts

from authentication import AdministratorAuthenticator
from handlers.base import BaseHandler, HandlerMethods
from xentools.xenadapter import XenAdapter


class RESTHandler(BaseHandler):
    def initialize(self, *args, **kwargs):
        super().initialize(self, *args, **kwargs)

    def prepare(self):
        super().prepare()
        if not 'Content-Type' in self.request.headers:
            return
        content_type = self.request.headers['Content-Type'].split(';')
        if content_type[0] == 'application/json':
            encoding = 'utf-8'
            try:
                encoding = content_type[1].split('=')[1]
            except:
                pass

            body = self.request.body.decode(encoding=encoding).strip()
            if body:
                json_data = json.loads(body)
                json_data_lists = {k: [v] for k, v in json_data.items()}
                self.request.arguments.update(json_data_lists)

                # monkey-patch decode argument
                self.decode_argument = lambda value, name: value

                # monkey-patch _get_arguments
                old_get_arguments = self._get_arguments
                self._get_arguments = lambda name, source, strip: old_get_arguments(name, source, False)


def auth_required(method):
    def decorator(self, *args, **kwargs):
        user = HandlerMethods.get_current_user(self)
        if not user:
            self.set_status(401)
            self.write({'status': 'error', 'message': 'not authorized'})
        else:
            self.user_authenticator = pickle.loads(user)
            self.user_authenticator.xen = XenAdapter({**opts.group_dict('xenadapter'), **opts.group_dict('rethinkdb')})
            self.xen = self.user_authenticator.xen
            return method(self)

    return decorator


def admin_required(method):
    def decorator(self, *args, **kwargs):
        user = HandlerMethods.get_current_user(self)
        if not user:
            self.set_status(401)
            self.write({'status': 'error', 'message': 'not authorized'})
        else:
            self.user_authenticator = pickle.loads(user)
            if not isinstance(self.user_authenticator, AdministratorAuthenticator):
                self.set_status(403)
                self.write({'status': 'error', 'message': 'administrator required'})
                return
            self.user_authenticator.xen = XenAdapter({**opts.group_dict('xenadapter'), **opts.group_dict('rethinkdb')})
            self.xen = self.user_authenticator.xen
            return method(self)

    return decorator