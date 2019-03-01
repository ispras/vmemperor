'''
GRAPHQL_XENBJECT_DICT determines which graphql types are associated with corresponding
RethinkDB tables. If a type is associated with a table, a subquery is created with that table
Key: str -> Graphql object type name
Value: XenObject class type
'''

GRAPHQL_XENOBJECT_DICT = {

}

def assign_xenobject_type_for_graphql_type(graphql_type, xenobject_type):
    GRAPHQL_XENOBJECT_DICT[graphql_type.__name__] = xenobject_type