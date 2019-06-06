
CREATE_DB_FOR_CLASSES = set()



def create_db_for_me(cl):
    CREATE_DB_FOR_CLASSES.add(cl)


CREATE_DB_FOR_CLASSES_WITH_ACL = set()

def create_acl_db_for_me(cl):
    CREATE_DB_FOR_CLASSES_WITH_ACL.add(cl)