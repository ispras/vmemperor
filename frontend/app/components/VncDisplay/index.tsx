import React, {Ref} from 'react';
import {arrayOf, string, bool, func, number, object} from 'prop-types';
import RFB from '@novnc/novnc/core/rfb';
import {init_logging} from '@novnc/novnc/core/util/logging';
import omit from 'object.omit';

interface Props {
  onDisconnect: () => any;
  url: string;
  onClipboard: (e: CustomEvent) => any;
}

export default class VncDisplay extends React.PureComponent<Props> {
  rfb: RFB;
  canvas: Ref<any>;


  static propTypes = {
    url: string.isRequired,
    style: object,
    width: number,
    height: number,
    encrypt: bool,
    wsProtocols: arrayOf(string),
    onClipboard: func,
    onUpdateState: func,
    onPasswordRequired: func,
    onBell: func,
    onDesktopName: func,
    connectTimeout: number,
    disconnectTimeout: number,
    shared: bool,
    onDisconnect: func,
  };

  static defaultProps = {
    style: {},
    encrypt: false,
    wsProtocols: ['binary'],
    trueColor: true,
    localCursor: true,
    debug: true,
    onDisconnect: null,
    connectTimeout: 5,
    disconnectTimeout: 5,
    width: 1280,
    height: 720,
  };


  componentDidMount() {
    /*  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production')
        init_logging('debug');
     */
    this.connect();
  }

  componentWillUnmount() {
    this.disconnect();
  }

  /*
    componentWillReceiveProps(nextProps) {
      if (!this.rfb) {
        return;
      }

      if (nextProps.scale !== this.props.scale) {
        this.rfb.get_display().set_scale(nextProps.scale || 1);
        this.get_mouse().set_scale(nextProps.scale || 1);
      }

    }
    */

  disconnect = () => {
    if (!this.rfb) {
      return;
    }

    this.rfb.disconnect();
    this.rfb = null;
  };

  onDisconnected = (e) => {
    if (this.props.onDisconnect) {
      this.props.onDisconnect();
      this.connect();
    }
  };

  connect = () => {
    this.disconnect();

    if (!this.canvas) {
      return;
    }


    const options = Object.assign(omit(this.props, [
      'name',
      'connectTimeout',
      'url',
      'width',
      'height',
      'debug',
    ]), {
      encrypt: this.props.url.startsWith('wss:') || this.props.encrypt,
      shared: true,
    });

    this.rfb = new RFB(this.canvas, this.props.url, {...options});
    this.rfb.focusOnClick = true;
    this.rfb.addEventListener("disconnect", this.onDisconnected);
    this.rfb.addEventListener("clipboard", this.props.onClipboard);
  };

  registerChild = (ref) => this.canvas = ref;

  render() {
    return (
      <div
        style={this.props.style}
        ref={this.registerChild}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}/>
    )
  }
}
