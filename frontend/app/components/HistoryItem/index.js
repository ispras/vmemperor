/**
*
* HistoryItem
*
*/

import React from 'react';
import T from 'prop-types';


class HistoryItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    item: T.any.isRequired,
    actions: T.object.isRequired,
  };

  render() {
    const { name, status, details } = this.props.item;
    let color;
    switch (status) {
      case -1:
        color = 'danger';
        break;
      case 100:
        color = 'suceess';
        break;
      default:
        color = null;
    }

    return (
      <tr className={color}>
        <td>{name}</td>
        <td>
          {status > 0 ?
            <div className="progress">
              <div className="progress-bar" aria-valuenow={status} aria-valuemin="0" aria-valuemax="100" style={{ width: `${status}%` }}>
                <span className="sr-only">{status}% Complete</span>
              </div>
            </div> : <b>Error</b>}
        </td>
        <td>{details}</td>
        <td>
          <button className="btn btn-danger" onClick={this.props.actions.stop}>Stop Tracking</button>
        </td>
      </tr>
    );
  }
}

export default HistoryItem;
