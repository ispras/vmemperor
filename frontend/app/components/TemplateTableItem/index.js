import _ from 'lodash';
import React, { PropTypes as T } from 'react';
import Multiselect from 'components/BootstrapMultiselect';
import Loader from 'components/Loader';

class TemplateItem extends React.Component {
  static propTypes = {
    item: T.any.isRequired,
    actions: T.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.renderOptions = this.renderOptions.bind(this);
    this.handleUpdateHooks = this.handleUpdateHooks.bind(this);
    this.onMirrorUrlChange = this.onMirrorUrlChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = this.getStateFromProps(props);
  }

  onMirrorUrlChange(e) {
    this.setState({ mirrorUrl: e.target.value });
  }

  getStateFromProps(props) {
    const conf = props.item.other_config;

    return {
      mirrorUrl: props.item.mirror(),
      hooks: conf.vmemperor_hooks,
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.actions.update(
      this.props.item
        .set('default_mirror', this.state.mirrorUrl)
        .update('other_config', v => ({ ...v, vmemperor_hooks: this.state.hooks }))
    );
  }

  handleUpdateHooks(option, isSelected) {
    this.setState({
      hooks: { [option.value]: isSelected },
    });
  }

  renderOptions(state) {
    const preparedData = _.map(this.state.hooks, (selected, name) => ({ value: name, selected }));
    if (state === 'Changing') {
      return null;
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="mirrorUrl">Select installation mirror.</label>
          <input
            id="mirrorUrl"
            type="text"
            className="form-control"
            value={this.state.mirrorUrl}
            onChange={this.onMirrorUrlChange}
          />
        </div>
        <div className="form-group">
          <Multiselect
            buttonText={options => `Hooks (${options.length} Selected)`}
            data={preparedData}
            onChange={this.handleUpdateHooks}
          />
          <input type="submit" value="update" className="btn btn-info" />
        </div>
      </form>
    );
  }

  render() {
    const { item, actions } = this.props;
    const state = item.state();

    let buttons;
    switch (state) {
      case 'Changing':
        buttons = <Loader />;
        break;
      default:
        buttons = item.tags.indexOf('vmemperor') >= 0 ?
          <button value="disable" className="btn btn-danger" onClick={() => actions.disable(item)}>Disable</button> :
          <button value="enable" className="btn btn-primary" onClick={() => actions.enable(item)}>Enable</button>;
        break;
    }

    return (
      <tr>
        <td>
          <blockquote>
            <p className="lead">{ item.name_label }</p>
            <footer>{ item.name_description }</footer>
          </blockquote>
        </td>
        <td>
          <blockquote>
            <p>{item.endpoint.description}</p>
            <footer>{item.endpoint.url}</footer>
          </blockquote>
        </td>

        <td className="col-md-3">
          { this.renderOptions(state) }
        </td>
        <td style={{ verticalAlign: 'middle' }}>
          { buttons }
        </td>
      </tr>
    );
  }
}

export default TemplateItem;
