import {Record} from 'immutable';

const VM = Record({ // eslint-disable-line new-cap
  VCPUs_at_startup: 0,
  allowed_operations: [],
  endpoint: {},
  guest_metrics: null,
  is_a_snapshot: false,
  is_a_template: false,
  is_control_domain: false,
  memory_dynamic_max: null,
  memory_dynamic_min: null,
  memory_target: null,
  name_description: '',
  name_label: '',
  networks: {},
  power_state: '',
  ref: null,
  changing: false,
});

VM.prototype.key = function key() {
  return this.ref;
};

VM.prototype.name = function name() {
  return this.name_label;
};

VM.prototype.description = function description() {
  return this.name_description;
};

VM.prototype.pool = function pool() {
  return this.endpoint.description;
};

VM.prototype.ip = function ip() {
  return this.networks ? this.networks['0/ip'] : '';
};

VM.prototype.state = function state() {
  if (this.changing) {
    return 'Changing';
  }
  return this.power_state;
};

VM.prototype.toApi = function toApi() {
  return {
    vm_ref: this.ref,
    endpoint_url: this.endpoint.url,
    endpoint_description: this.endpoint.description,
  };
};

export default VM;
