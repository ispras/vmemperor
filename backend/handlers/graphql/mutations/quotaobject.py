from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.types.input.quotaobject import QuotaObjectInput
import constants.re as re
from utils.user import get_user_object
from xenadapter.quotaobject import QuotaObject


def set_main_owner(input, qo : QuotaObject):
    '''
    This function is to be used with mutations. It calls set_main_owner of a QuotaObject
    :param owner:
    :return:
    '''
    old_val = {"main_owner" : qo.get_main_owner()}

    qo.set_main_owner(input.main_owner)
    return old_val, input

def main_owner_validator(input: QuotaObjectInput, qo: QuotaObject, ctx: ContextProtocol):
    '''
    Checks if a new main_owner is among owners. Or if a new main_owner is none, then it's admin who mutates
    :param input:
    :param qo:
    :param ctx:
    :return:
    '''
    if input.main_owner is None:
        if not ctx.user_authenticator.is_admin():
            return False, "Only administrator can set main_owner to null"
    elif not input.main_owner:
        return False, None
    else:
        user_object = get_user_object(input.main_owner)
        if not user_object:
            return False, "main_owner: invalid value"

        if not ctx.user_authenticator.is_admin():
            access_rights_quota = re.db.table(f'{qo.db_table_name}_user')\
                  .get_all((qo.ref, input.main_owner), index='ref_and_userid').coerce_to('array').run()

            if not len(access_rights_quota) or access_rights_quota[0]['actions'][0] != 'ALL':
                return False, f"{ctx.user_authenticator.get_id()} is not an owner of object {qo}, so it can't be a main owner"

    return True, None



