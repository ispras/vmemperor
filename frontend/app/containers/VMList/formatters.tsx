import {
  PowerState,
  VMListFragmentFragment, VMListVIFFragmentFragment,

} from "../../generated-models";
import * as React from "react";
import {Fragment} from "react";
import moment from "moment";

export const VIFsFormatter = (cell: VMListVIFFragmentFragment[], row: VMListFragmentFragment) => {
  return <Fragment>
    {cell.filter(item => item.ipv6 || item.ipv4)
      .map((item, index) => {
        return (
          <div>
            <b>{item.ipv4 && (<span>{item.ipv4}</span>)}</b>
            {item.ipv6 &&
            (<span>{item.ipv4 && <span>{", "}</span>}<b>{item.ipv6}</b></span>)}
            {' '} on {item.network.nameLabel}
          </div>
        )
      })}
  </Fragment>
};

export const uptimeFormatter = (cell: any, row: VMListFragmentFragment) => {
  if (!cell || row.powerState === PowerState.Halted)
    return null;
  const m = moment(cell);
  return m.fromNow(true);
};
