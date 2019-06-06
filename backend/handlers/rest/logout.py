from handlers.rest.base import RESTHandler


class LogOut(RESTHandler):
    def get(self):
        self.clear_cookie('user')
        # self.redirect(self.get_argument("next", "/login"))
        self.write({'status': 'ok'})