from typing import Optional, Union, Collection

from graphql import ResolveInfo

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

                    if fields[item]['_list_']:
                        query.append(f".merge(lambda value: {{'{item}': re.db.table('{xentype.db_table_name}')" \
                          f".get_all(re.r.args(value['{item}'])).coerce_to('array')")
                        add_fields(fields[item], prefix=''.join((new_prefix, "[*].")))
                        query.append("})")
                    else:
                        query.append(f".merge(lambda value: {{'{item}': re.db.table('{xentype.db_table_name}')" \
                            f".get(value['{item}'])")
                        add_fields(fields[item], prefix=''.join((new_prefix, '.')))
                        query.append("})")

        xenobject_type = self.fields['_xenobject_type_']
        if not self.authenticator or not issubclass(xenobject_type, ACLXenObject) or self.authenticator.is_admin():
            query = [f"re.db.table('{xenobject_type.db_table_name}')"]
            if isinstance(self.id, str):
                query.append(f".get('{self.id}')")
            elif isinstance(self.id, Collection):
                query.append(".get_all(")
                query.append(','.join((f"'{item}'" for item in self.id)))
        else:
            query = [f"re.db.table('{xenobject_type.db_table_name}_user').get_all("]
            query.append(f','.join([f"'{item}'" for item in user_entities()]))
            query.append(",index='userid').pluck('ref')")
            query.append(f".merge(lambda value: re.db.table('{xenobject_type.db_table_name}').get(value['ref']).without('ref'))")

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