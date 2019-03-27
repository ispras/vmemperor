import React, { PropTypes as T } from 'react';
import Loader from 'components/Loader';

class VMItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    item: T.any.isRequired,
    actions: T.object.isRequired,
  };

  render() {
    const { item, actions } = this.props;

    let buttons;
    let stateLabel;
    switch (item.state()) {
      case 'Changing':
        stateLabel = null;
        buttons = <Loader />;
        break;
      case 'Halted':
        stateLabel = <span className="label label-warning">Halted</span>;
        buttons = <a className="btn btn-primary btn-xs" onClick={() => actions.start(item)}>start</a>;
        break;
      case 'Running':
        stateLabel = <span className="label label-success">Running</span>;
        buttons = <a className="btn btn-danger btn-xs" onClick={() => actions.shutdown(item)}>shutdown</a>;
        break;
      default:
        buttons = null;
        stateLabel = null;
    }

    return (
      <tr>
        <td><strong>{item.name()}</strong> <i>{item.description()}</i></td>
        <td>{item.pool()}</td>
        <td>{item.ip()}</td>
        <td>{stateLabel}</td>
        <td>{buttons}</td>
      </tr>
    );
  }
}

export default VMItem;
