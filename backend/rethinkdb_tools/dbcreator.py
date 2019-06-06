from .db_classes import create_db_for_me


class DBCreator(type):
    def __init__(cls, what, bases=None, dict=None):
        super().__init__(what, bases, dict)
        create_db_for_me(cls)
