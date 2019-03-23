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
from typing import Optional, List

from graphql import GraphQLList, ResolveInfo, GraphQLUnionType
from graphql.language.ast import Field, FragmentSpread, FragmentDefinition
from graphql.utils.get_field_def import get_field_def

from handlers.graphql.utils.string import underscore


def collect_fields(node : Field , fragments, return_type, get_field_type):
    """Recursively collects fields from the AST
    Args:
        node : A node in the AST
        fragments : Fragment definitions
        return_type: Type of node
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
        if isinstance(node, FragmentDefinition) and isinstance(return_type[0], GraphQLUnionType):
            for type in return_type[0].types:
                if type.name == node.type_condition.name.value:
                    my_return_type = type
                    break
            else:
                raise TypeError(f"Unable to find type by type condition for fragment {node}")
        else:
            my_return_type = return_type[0]
        for leaf in node.selection_set.selections:
            if isinstance(leaf, Field):
                field.update({
                    underscore(leaf.name.value): collect_fields(leaf, fragments, get_field_type(my_return_type, leaf), get_field_type)
                })
            elif isinstance(leaf, FragmentSpread):
                field.update(collect_fields(fragments[leaf.name.value],
                                            fragments, return_type, get_field_type))
    field["_xenobject_type_"] = return_type[0].xentype if hasattr(return_type[0], "xentype") else None
    field["_list_"] = return_type[1]
    return field


def get_fields(info : ResolveInfo, select_subfield : Optional[List] = None ):
    """A convenience function to call collect_fields with info
    Args:
        info (ResolveInfo)
        select_subfield - path to "root" field in info we call collect_fields against
    Returns:
        dict: Returned from collect_fields
    """

    fragments = {}



    def get_field_type(parent_type, leaf):
        field_def = get_field_def(info.schema, parent_type, leaf)
        if not field_def:
            import sentry_sdk
            sentry_sdk.capture_message("field_def returned None, this is discouraging")
        type = field_def.type
        is_list = False
        while hasattr(type, 'of_type') and type.of_type:
            if isinstance(type, GraphQLList):
                is_list = True
            type = type.of_type

        return type, is_list

    operation_type = info.parent_type

    for ast in info.field_asts:
        if ast.name.value == info.field_name:
            node = ast
            while select_subfield:
                current_field = select_subfield.pop(0)
                operation_type, _ = get_field_type(operation_type, node)
                node = tuple(filter(lambda selection: selection.name.value == current_field,
                                    node.selection_set.selections))[0]

            break
    else:
        raise ValueError(f"Unable to find AST for path {info.path}")
    fields = collect_fields(node, info.fragments, get_field_type(operation_type, node), get_field_type)
    return fields