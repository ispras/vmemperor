"""
MIT License
Copyright (c) 2018 Mitchel Cabuloy
Copyright (c) 2019 Pavel Borisov
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""
from graphql import GraphQLList
from graphql.language.ast import Field, FragmentSpread
from graphql.utils.ast_to_dict import ast_to_dict
from graphql.utils.get_field_def import get_field_def

def underscore(string : str):
    l = list()
    for n, symbol in enumerate(string):
        if symbol.isupper() and n > 0 and  not string[n-1].isupper():
            l.extend(['_', symbol.lower()])
        else:
            l.append(symbol)

    return "".join(l)




def collect_fields(node : Field , fragments, return_type, get_field_type):
    """Recursively collects fields from the AST
    Args:
        node : A node in the AST
        fragments : Fragment definitions
    Returns:
        A dict mapping each field found, along with their sub fields.
        {'name': {},
         'sentimentsPerLanguage': {'id': {},
                                   'name': {},
                                   'totalSentiments': {}},
         'slug': {}}
    """

    field = {}
    if node.selection_set:
        for leaf in node.selection_set.selections:
            if isinstance(leaf, Field):
                field.update({
                    underscore(leaf.name.value): collect_fields(leaf, fragments, get_field_type(return_type[0], leaf), get_field_type)
                })
            elif isinstance(leaf, FragmentSpread):
                field.update(collect_fields(fragments,
                                            fragments[underscore(leaf.name.value)], get_field_type(return_type[0], leaf), get_field_type))
    field["_xenobject_type_"] = return_type[0].xentype if hasattr(return_type[0], "xentype") else None
    field["_list_"] = return_type[1]
    return field


def get_fields(info):
    """A convenience function to call collect_fields with info
    Args:
        info (ResolveInfo)
    Returns:
        dict: Returned from collect_fields
    """

    fragments = {}

    #node = ast_to_dict(info.field_asts[0])
    operation_type = info.parent_type
    node = info.field_asts[0]
    #for name, value in info.fragments.items():
    #    fragments[name] = ast_to_dict(value)

    def get_field_type(parent_type, leaf):
        field_def = get_field_def(info.schema, parent_type, leaf)
        type = field_def.type
        is_list = False
        while hasattr(type, 'of_type') and type.of_type:
            if isinstance(type, GraphQLList):
                is_list = True
            type = type.of_type
        return type, is_list


    return collect_fields(node, info.fragments, get_field_type(operation_type, node), get_field_type)