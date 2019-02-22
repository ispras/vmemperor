from .xenobject import XenObject
import constants.re as re
class VMGuest(XenObject):
    api_class = 'VM_guest_metrics'
    #EVENT_CLASSES = ['vm_guest_metrics']

    @classmethod
    def process_event(cls, xen, event):
        '''
        Make changes to a RethinkDB-based cache, processing a XenServer event
        :param auth: auth object
        :param event: event dict
        :param db: rethinkdb DB
        :param authenticator_name: authenticator class name - used by access control
        :return: nothing
        '''
        from rethinkdb_tools.helper import CHECK_ER
        from .vm import VM


        if event['class'] in cls.EVENT_CLASSES:
            if event['operation'] == 'del':
                #handled by VM
                return

            record = event['snapshot']


            if event['operation'] in ('mod', 'add'):
                rec = re.db.table(VM.db_table_name).get_all(event['ref'], index='guest_metrics').pluck('uuid').run().items
                if len(rec) != 1:
                    #auth.xen.log.warning(
                    #    f"VMGuest::process_event: Cannot find a VM (or theres more than one)"
                    #    f" for guest metrics {event['ref']}")
                    # TODO Snapshots
                    return
                vm_uuid = rec[0]['uuid']
                new_rec = {'uuid': vm_uuid, 'os_version': record['os_version'],'interfaces': {},
                           'PV_drivers_version': record['PV_drivers_version'], 'PV_drivers_up_to_date': record['PV_drivers_up_to_date']}
                for k,v in record['networks'].items():
                    try:
                        net_name, key, *rest = k.split('/')
                        new_rec['interfaces'][net_name] = {**new_rec['interfaces'][net_name], **{key: v}} if net_name in new_rec['interfaces'] else {key: v}
                    except ValueError:
                        auth.xen.log.warning("Can't get network information for VM {0}: {1}:{2}".format(vm_uuid, k, v))






                #new_rec = {'uuid': vm_uuid, 'networks' : {record['device']:
                #{'VIF': record['uuid'], 'network': net.uuid, 'attached': record['currently_attached'], 'MAC': record['MAC'], 'status': record['status_detail']}} }

                CHECK_ER(re.db.table(VM.db_table_name).insert(new_rec, conflict="update").run())

