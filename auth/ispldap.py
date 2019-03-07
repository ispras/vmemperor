import traceback
from authentication import *
import ldap3
from ldap3.utils.conv import escape_bytes
import ldap3.core.exceptions
import uuid
import logging
from exc import *
from exc import AuthenticationPasswordException


class LDAPIspAuthenticator(BasicAuthenticator):
    SERVER_IP = '83.149.198.139'
    @classmethod
    def guid_to_search(cls, guid):
        return escape_bytes(uuid.UUID(guid).bytes_le)


    @classmethod
    def get_all_groups(cls, log=logging):
        conn = cls.connect(log)

        search_filter = "(&(objectClass=group)(cn=*))"

        conn.search(search_base='dc=intra,dc=ispras,dc=ru', search_filter=search_filter,
                attributes=['sAMAccountName', 'objectGUID', 'name'], search_scope=ldap3.SUBTREE)
        if conn.entries:
            def return_data(entry):
                return {
                    "id" : entry.objectGUID.value,
                    "username" : entry.sAMAccountName.value,
                    "name": entry.name[0]
                }

            return [return_data(e) for e in conn.entries]


    @classmethod
    def get_group_name_by_id(cls, id, log=logging):
        conn = cls.connect(log)

        search_filter = "(&(objectGUID={0}))".format(cls.guid_to_search(id))


        conn.search(search_base='dc=intra,dc=ispras,dc=ru', search_filter=search_filter,
                attributes=['sAMAccountName'], search_scope=ldap3.SUBTREE, paged_size=1)
        if conn.entries:
            return conn.entries[0].sAMAccountName.value
        else:
            log.error("LDAP: No such group: GUID %s" % id)


  #  def initialize(self, executor):
  #      '''
  #      Establishes connection to a ldap server
  #     :return:
  #      '''
  #      super().initialize(executor)



        #self.id = None
        #self.given_name = None

    def get_id(self):
        '''

        :return: Unique user identifier
        '''
        if not self.id:
            raise RuntimeError("Not authorized")
        return self.id

    def get_name(self):
        if not self.given_name:
            return self.get_id()
        else:
            return self.given_name

    @classmethod
    def get_all_users(cls, log=logging):
        conn = cls.connect(log)

        search_filter = "(&(objectClass=person)(!(objectClass=computer))(!(objectClass=group))(!(UserAccountControl:1.2.840.113556.1.4.803:=2))(cn=*))"
        conn.search(search_base='dc=intra,dc=ispras,dc=ru', search_filter=search_filter,
                    attributes=['objectGUID', 'name', 'sAMAccountName'], search_scope=ldap3.SUBTREE)

        if conn.entries:
            def return_data(entry):
                return {
                    "id" : entry.objectGUID.value,
                    "username" : entry.sAMAccountName.value,
                    "name": entry.name[0]
                }

            return [return_data(e) for e in conn.entries]

    def check_credentials(self, password, username, log=logging):
        '''
        Checks credentials
        :param password:
        :param username:
        :param log: logger
        '''
        conn = self.connect(log)

        self.username=username
        self.password = password
        search_filter= f"(&(objectClass=person)(!(objectClass=computer))(!(UserAccountControl:1.2.840.113556.1.4.803:=2))(cn=*)(sAMAccountName={username}))"
        conn.search(search_base='dc=intra,dc=ispras,dc=ru',search_filter=search_filter,
        attributes=['name', 'mail'], search_scope=ldap3.SUBTREE, paged_size=1)
        if conn.entries:
           try:
               mail = conn.entries[0].mail[0]
               givenName = conn.entries[0].name[0]
               log.debug("Authentication entry found, e-mail: {0}, givenName: {1}".format(mail, givenName))


           except:
               raise AuthenticationUserNotFoundException(log,self)

           dn = conn.entries[0]
           check_login = ldap3.Connection(self.SERVER_IP, user=dn.entry_dn, password=password)
           try:
               if check_login.bind():
                   log.info("Authentication as {0} successful".format(username))
                   login_connection = check_login
                   self.given_name = givenName
                   check_login.search(search_base='dc=intra,dc=ispras,dc=ru', search_filter=search_filter,
               attributes=['objectGUID'], search_scope=ldap3.SUBTREE, paged_size=1)
                   self.id = check_login.entries[0].objectGUID.value
                   # find groups
                   conn.search(search_base='dc=intra,dc=ispras,dc=ru', search_filter=search_filter,
                               attributes=['memberOf'], search_scope=ldap3.SUBTREE, paged_size=1)
                   # group queue
                   search_filter = "(&(objectClass=group)(!(objectClass=computer))(!(UserAccountControl:1.2.840.113556.1.4.803:=2))(cn=*)(sAMAccountName=%s))"
                   log.info("Obtaining groups for %s" % username)
                   def get_group_id(name):
                       conn.search(search_base='dc=intra,dc=ispras,dc=ru', search_filter=search_filter % name,
                               attributes=['objectGUID'], search_scope=ldap3.SUBTREE, paged_size=1)
                       if conn.entries:
                           return conn.entries[0].objectGUID.value


                   groups = (group.split(',')[0].split('=')[1] for group in conn.entries[0].memberOf)
                   self.groups = {get_group_id(g): g for g in groups}


                   return
               else:
                   raise AuthenticationPasswordException(log,self)
           except: #empty password
               raise AuthenticationWithEmptyPasswordException(log,self)
        else:
            raise AuthenticationUserNotFoundException(log,self)

    @classmethod
    def connect(cls, log):
        server = ldap3.Server(cls.SERVER_IP)
        conn = ldap3.Connection(server, user='mailuser', password='mailuser', raise_exceptions=False)

        def print_error(arg):
            log.error(f"Unable to establish connection to LDAP server {server.host}: {arg}")
            raise ConnectionError(conn)
        try:
            if not conn.bind():
                print_error("Connection not bound")
        except Exception as e:
            print_error(str(e))
            traceback.print_exc()


        return conn

    def get_user_groups(self):
        '''
        Get dict of user groups: id -> name
        '''
        return self.groups

    def set_user_group(self):
        raise NotImplementedError()
