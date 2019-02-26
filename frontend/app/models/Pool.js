import { Record } from 'immutable';

const Pool = Record({ // eslint-disable-line new-cap
  description: '',
  hdd_available: null,
  host_list: [],
  ref: '',
  networks: [],
  storage_resources: [],
  templates_enabled: [],
  url: '',
});

Pool.prototype.key = function key() {
  return this.id;
};

Pool.prototype.description = function description() {
  return this.name_description;
};

export default Pool;
