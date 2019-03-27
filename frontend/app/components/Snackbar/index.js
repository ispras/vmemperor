/**
*
* Snackbar
*
*/

import React from 'react';
import styles from './styles.css';
import T from 'prop-types';


const RENDER_TICK = 500;
const TTR = 3000;
const TTL = 8000;

function computeClass({ type, timestamp }, renderStamp) {
  const lived = (renderStamp - timestamp) / TTR;
  const baseClass = ['alert', lived > 1 ? styles.alertFade : ''];
  switch (type) {
    case 'suc':
      return baseClass.concat('alert-success').join(' ');
    case 'warn':
      return baseClass.concat('alert-warning').join(' ');
    case 'err':
      return baseClass.concat('alert-danger').join(' ');
    default:
      return baseClass.concat('alert-info').join(' ');
  }
}

class Snackbar extends React.Component {
  static propTypes = {
    logs: T.arrayOf(T.shape({
      type: T.string.isRequired,
      text: T.string.isRequired,
      timestamp: T.number.isRequired,
    })),
  };

  componentDidMount() {
    this.interval = setInterval(() => this.forceUpdate(), RENDER_TICK);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const renderStamp = +new Date();
    const alerts = this.props.logs
      .filter(alert => rednerStamp - alert.timestamp < TTL)
      .slice(0, 10);

    return (
      <div className={styles.snackbarContainer}>
        <div className={[styles.snackbar, styles.snackbarOpened].join(' ')}>
          <span className={styles.snackbarOpened}>
            {
              alerts.map(alert =>
                <div key={alert.timestamp} className={computeClass(alert, renderStamp)} role="alert">{alert.text}</div>)
            }
          </span>
        </div>
      </div>
    );
  }
}

export default Snackbar;


