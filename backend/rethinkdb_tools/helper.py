def CHECK_ER(ret):
    if ret['errors']:
        raise ValueError(f'Failed to modify data: {ret["first_error"]}')
    if ret['skipped']:
        raise ValueError(f'Failed to modify data: skipped - {ret["skipped"]}')