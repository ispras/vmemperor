import { Record } from 'immutable';
import T from 'prop-types';
import {Access} from "./types";


//Format is determined in xenadapter/disk.py class ISO
const Network = Record({
  name_label: '',
  name_description: '',
  ref: '',
  ref: '',
  other_config: {},
  access: [],
  PIFs: [],
  VIFs: [],
});

Network.prototype.key = () => { return this.ref; };

export const NetworkShape = T.shape(
  {
    ref: T.string.isRequired,
    name_label: T.string.isRequired,
    name_description: T.string.isRequired,
    access: Access,
    other_config: T.oneOfType([
      T.shape(
        {
          automatic: T.bool.isRequired,
        }
      ),
      T.shape(
        {
          gateway: T.string,
          ip_begin: T.string,
          ip_disable_gw: T.string,
          ip_end: T.string,
          netmask: T.string,
        }
      )
    ]),

  });

export default Network;
