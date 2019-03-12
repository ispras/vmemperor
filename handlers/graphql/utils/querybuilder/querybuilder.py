from typing import Optional, Union, Collection
from collections.abc import Iterable

from graphql import ResolveInfo
import itertools
from authentication import BasicAuthenticator
from handlers.graphql.utils.querybuilder.get_fields import get_fields
from xenadapter.xenobject import ACLXenObject
import  constants.re as re


class QueryBuilder:
    '''
    Build a sophisticated changefeed and put its results in asyncio.Queue
    It works by traversing GraphQL ResolveInfo AST and finding out dependencies of
    sophisticated GraphQL query ("ref" fields).

    '''
    def __init__(self, id: Optional[Union[str, Collection]], info: ResolveInfo, user_authenticator: Optional[BasicAuthenticator] = None, additional_string = None, select_subfield=None):
        '''

        :param queue: Queue to put results into. If None, yield_values acts as generator
        :param id:  Object ID (ref) to query. If many, query many objects. If None, query ALL objects. NB: Don't subscribe to ALL objects as all we want is to send one object at a time
        :param info:  GraphQL ResolveInfo field
        :param user_authenticator: Build query for all items with user table. This param is only used if id is None
         :param additional_string Add string to query. This may be used to support filtering, etc. NB: Don't use with subscriptions.
         :param select_subfield. A list representing path to subfield that is supposed to be analyzed in info
        '''
        self.fields = get_fields(info, select_subfield)
        self.authenticator = user_authenticator
        self.id = id
        self.paths = {} # Key - JSONPath expression, value - database table name. Contains dependent paths
        self.query = self.build_query(additional_string)

    def build_query(self, additional_string):
        def user_entities():
            yield f'users/{self.authenticator.get_id()}'
            yield 'any'
            for group in self.authenticator.get_user_groups():
                yield f'groups/{group}'


        def group_by_ref(table_name):
            query = [".group('ref')",
                     ".map(lambda value: value['actions'])"
                     ".reduce(lambda left, right: left.set_union(right)).ungroup().map(",
                     f"lambda value: value.merge(re.db.table('{table_name}').get(value['group'])",
                     ".merge({'my_actions': value['reduction']})).without('group', 'reduction'))"]
            return ''.join(query)

        def get_all_user_items(table_name):
            query = [f"re.db.table('{table_name}_user').get_all("]
            query.append(f','.join([f"'{item}'" for item in user_entities()]))
            query.append(",index='userid')")
            query.append(group_by_ref(xenobject_type.db_table_name))
            return ''.join(query)



        def get_some_user_items(table_name, item_name, list=False):
            '''
            Get items from table_name_user, which has the following structure:
            >>> [{'actions': ['ALL'],
            >>> 'id': '39fd1bac-14fd-44d5-b839-444b04c54529',
            >>> 'ref': 'OpaqueRef:922c7bf1-0676-4c8e-a202-9cfa09c08e09',
            >>> 'userid': 'groups/{841a3f55-b249-407e-9740-cddcc1ef18f4}'}]

            Get values by ref and userid, group by ref (collecting all actions from all user's groups and user itself)
            put collected actions in my_actions, reduce to one item if list=False

            :param table_name:
            :param item_name: where in parent query the items are contained
            :param list: should this verb return list of values (i.e. is value[item_name] a list)
            :return:
            '''
            query = [
                f"re.db.table('{table_name}_user')"
            ]
            if list:
                query.append(f".get_all(re.r.args(value['{item_name}'].concat_map(lambda value: [")
                query.append(','.join((f"[value, '{entity}']" for entity in user_entities())))
                query.append("]))")
            else:
                query.append(f".get_all(")
                query.append(','.join((f"[value['{item_name}'], '{entity}']" for entity in user_entities())))

            query.append(", index='ref_and_userid')")

            query.append(group_by_ref(table_name))
            if not list:
                query.append(".reduce(lambda left, right: left).default(None)")
            return ''.join(query)

        def get_one_user_item_by_id(table_name):
            query = [
                f"re.db.table('{table_name}_user')"
            ]
            query.append(f".get_all(")
            query.append(','.join((f"['{self.id}', '{entity}']" for entity in user_entities())))
            query.append(", index='ref_and_userid')")
            query.append(group_by_ref(table_name))
            query.append(".reduce(lambda left, right: left).default(None)")
            return ''.join(query)

        def get_some_user_items_by_id(table_name):
            query = [
                f"re.db.table('{table_name}_user')"
            ]
            query.append(f".get_all(")
            query.append(','.join((f"['{id}', '{entity}']" for id, entity in itertools.product(self.id, user_entities()))))
            query.append(", index='ref_and_userid')")

            query.append(group_by_ref(table_name))
            return ''.join(query)

        def add_my_actions_for_admin(xentype, list=False):
            '''
            Add field my_actions for ACLXenObjects that are queried from admin.
            :param xentype:
            :param list:
            :return:
            '''
            if not issubclass(xentype, ACLXenObject):
                return ""

            if list:
                return ".map(lambda item: item.merge({'my_actions': ['ALL']}))"
            else:
                return ".merge({'my_actions': ['ALL']})"

        def add_fields(fields, prefix=""):
            '''
            Populates self.paths - JSONPath expressions for gathering dependent refs
            and nonlocal query variable to  ReQL query string for this subscription

            :param fields: subdict of self.fields to be processed
            :param prefix: JSONPath of these fields
            '''
            nonlocal query

            self.paths[prefix + 'ref'] = fields['_xenobject_type_']
            _fields = [field for field in fields if field not in ('_xenobject_type_', '_list_')]
            if 'ref' not in _fields:
                _fields.append('ref')
            #query.append(".pluck(")
            #query.append(",".join((f"'{item}'" for item in _fields)))
            #query.append(")")
            for item in _fields:
                if item == 'ref':
                    continue
                xentype = fields[item]['_xenobject_type_']
                if xentype:
                    new_prefix = ''.join((prefix, item))
                    admin_query = not self.authenticator or not issubclass(xentype, ACLXenObject) or self.authenticator.is_admin()
                    if fields[item]['_list_']:
                        if admin_query:
                            query.append(f".merge(lambda value: {{'{item}': re.db.table('{xentype.db_table_name}')" \
                              f".get_all(re.r.args(value['{item}'])).coerce_to('array')")
                            add_fields(fields[item], prefix=''.join((new_prefix, "[*].")))
                            query.append("})")
                            query.append(add_my_actions_for_admin(xentype, list=True))
                        else:
                            query.append(f".merge(lambda value: {{'{item}' : ")
                            query.append(get_some_user_items(xentype.db_table_name, item, list=True))
                            add_fields(fields[item], prefix=''.join((new_prefix, '.')))
                            query.append('})')
                    else:
                        if admin_query:
                            query.append(f".merge(lambda value: {{'{item}': re.db.table('{xentype.db_table_name}')" \
                                f".get(value['{item}'])")
                            add_fields(fields[item], prefix=''.join((new_prefix, '.')))
                            query.append("})")
                            query.append(add_my_actions_for_admin(xentype))

                        else:
                            query.append(f".merge(lambda value: {{'{item}':")
                            query.append(get_some_user_items(xentype.db_table_name, item))
                            add_fields(fields[item], prefix=''.join((new_prefix, '.')))
                            query.append('})')

        xenobject_type = self.fields['_xenobject_type_']
        if not self.authenticator or not issubclass(xenobject_type, ACLXenObject) or self.authenticator.is_admin():
            query = [f"re.db.table('{xenobject_type.db_table_name}')"]
            if isinstance(self.id, str):
                query.append(f".get('{self.id}')")
                query.append(add_my_actions_for_admin(xenobject_type))
            elif isinstance(self.id, Collection):
                query.append(".get_all(")
                query.append(','.join((f"'{item}'" for item in self.id)))
                query.append(add_my_actions_for_admin(xenobject_type, list=True))
            else:
                query.append(add_my_actions_for_admin(xenobject_type, list=True))
        else:
            query = []
            if not self.id:
                query.append(get_all_user_items(xenobject_type.db_table_name))
            elif isinstance(self.id, str):
                query.append(get_one_user_item_by_id(xenobject_type.db_table_name))
            elif isinstance(self.id, Iterable):
                query.append(get_some_user_items_by_id(xenobject_type.db_table_name))



        add_fields(self.fields)
        if additional_string:
            query.append(additional_string)
        query = ''.join(query)
        return eval(query)

    def run_query(self, connection=None):
        if isinstance(self.id, str):
            query = self.query
        else:
            query = self.query.coerce_to('array')

        if connection:
            return query.run(connection)

        return query.run()