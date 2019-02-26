import { Record } from 'immutable';


const VM = Record(
  {
    name_label: '',
    name_description: '',
    networks: {},
    start_time: new Date(0),
    install_time: new Date(0),
    domain_type: '',
    access: [],
    disks: {},
    ref: '',
    ref: '',
    memory_actual: '',
    PV_drivers_up_to_date: false,
    PV_drivers_version: {},
    os_version: {},
    power_state: 'Halted',
  });

export default VM;

//TODO: KeyType.shape
