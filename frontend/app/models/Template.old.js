import {Record} from 'immutable';

const Template = Record({ // eslint-disable-line new-cap
  endpoint: {},
  ref: null,
  tags: [],
  other_config: {},
  name_label: '',
  default_mirror: '',
  install_repository: null,
  allowed_operations: [],
  is_a_template: true,
  name_description: '',
  is_control_domain: false,
  is_a_snapshot: false,
  changing: false,
});

Template.prototype.key = function key() {
  return this.ref;
};

Template.prototype.name = function name() {
  return this.name_label;
};

Template.prototype.state = function state() {
  return this.changing ? 'Changing' : 'Stable';
};

Template.prototype.description = function description() {
  return this.name_description;
};

Template.prototype.pool = function pool() {
  return this.endpoint.description;
};

Template.prototype.mirror = function mirror() {
  return this.other_config.install_repository || this.other_config.default_mirror;
};

Template.prototype.toApi = function toApi() {
  return {
    vm_ref: this.ref,
    endpoint_url: this.endpoint.url,
    endpoint_description: this.endpoint.description,
    default_mirror: this.default_mirror,
    vmemperor_hooks: this.other_config.vmemperor_hooks,
  };
};

export default Template;
