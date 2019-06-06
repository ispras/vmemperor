from xenadapter.aclxenobject import ACLXenObject
import  constants.re as re


class QuotaObject(ACLXenObject):
    MAIN_OWNER_KEY = 'vmemperor-main-owner'

    @classmethod
    def process_record(cls, xen, ref, record):
        new_rec = super().process_record(xen, ref, record)
        new_rec['main_owner'] = cls.get_main_owner_from_other_config(record['other_config'])
        return new_rec

    def set_main_owner(self, owner):
        '''
        Set "Main owner" for this quota object.

        A main owner is an owner against whom the quotas are calculated.

        For example, for VM the quotas are:
        VM count - limit of VMs main-owned by the user
        memory - limit of memory used by the VMs of user

        :param owner:
        :return:
        '''


        other_config = self.get_other_config()
        if owner:
            other_config[self.MAIN_OWNER_KEY] = owner
        elif self.MAIN_OWNER_KEY in other_config:
            del other_config[self.MAIN_OWNER_KEY]
        else:
            return

        self.set_other_config(other_config)

    @classmethod
    def get_main_owner_from_other_config(cls, other_config):
        return other_config.get(cls.MAIN_OWNER_KEY)

    def get_main_owner(self):
        return self.get_main_owner_from_other_config(self.get_other_config())

    @classmethod
    def create_db(cls, indexes=()):
        my_indexes = ['main_owner']
        my_indexes.extend(indexes)
        super(QuotaObject, cls).create_db(indexes=my_indexes)
