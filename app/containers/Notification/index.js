/**
 *
 * Notification
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import SweetAlert from 'react-bootstrap-sweetalert';
import withStyles from '@material-ui/core/styles/withStyles';
import VoteUs from 'containers/VoteUs/Loadable';
import { makeSelectEosAccount } from 'containers/Scatter/selectors';

import {
  makeSelectNotificationFailure,
  makeSelectNotificationLoading,
  makeSelectNotificationMessage,
  makeSelectNotificationSuccess,
} from './selectors';
import { closeNotification } from './actions';
import reducer from './reducer';
import saga from './saga';

import sweetAlertStyle from './sweetAlertStyle';

// eslint-disable-next-line react/prefer-stateless-function
export class Notification extends React.Component {
  render() {
    const { loading, failure, success, message, closeAll, eosAccount } = this.props;
    if (loading) {
      return (
        <SweetAlert
          info
          style={{ display: 'block', marginTop: '-100px' }}
          title="Sending..."
          onConfirm={() => closeAll()}
          confirmBtnText="Hide"
          // onCancel={() => closeAll()}
          confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.info}`}>
          <h5>Scatter should appear shortly to confirm this action.</h5>
          <h6>Your transaction will be sent to the network afterwards</h6>
        </SweetAlert>
      );
    }
    if (success) {
      return (
        <SweetAlert
          success
          style={{ display: 'block', marginTop: '-100px' }}
          title="Success"
          onConfirm={() => closeAll()}
          confirmBtnText="Thanks"
          confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.success}`}>
          <h6>
            {message ? (
              <a href={`https://bloks.io/transaction/${message}`} target="new">
                TxId: {message}
              </a>
            ) : (
              ''
            )}
          </h6>
          <p>Thank you for using EOSToolkit.io</p>
          <h6>Your votes support continued development of these tools</h6>
          <h5>
            <VoteUs />
          </h5>
        </SweetAlert>
      );
    }
    if (failure && eosAccount !== '') {
      return (
        <SweetAlert
          danger
          style={{ display: 'block', marginTop: '-100px' }}
          title="Failure"
          onConfirm={() => closeAll()}
          confirmBtnText="Close"
          confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.danger}`}>
          <h6>Transaction has failed</h6>
          <h6>{message ? `Details: ${JSON.stringify(message)}` : ''}</h6>
        </SweetAlert>
      );
    }
    if (failure && eosAccount === '') {
      return (
        <SweetAlert
          danger
          style={{ display: 'block', marginTop: '-100px' }}
          title="Failure"
          onConfirm={() => closeAll()}
          confirmBtnText="Close"
          // onCancel={() => closeAll()}
          confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.danger}`}>
          <h5>You must install and connect Scatter</h5>
          <h5>
            <a href={`https://get-scatter.com/`} target="new">
              Get Scatter
            </a>
          </h5>
        </SweetAlert>
      );
    }
    return '';
  }
}

Notification.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  success: makeSelectNotificationSuccess(),
  failure: makeSelectNotificationFailure(),
  loading: makeSelectNotificationLoading(),
  message: makeSelectNotificationMessage(),
  eosAccount: makeSelectEosAccount(),
});

function mapDispatchToProps(dispatch) {
  return {
    closeAll: () => dispatch(closeNotification()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const styles = withStyles(sweetAlertStyle);
const withReducer = injectReducer({ key: 'notification', reducer });
const withSaga = injectSaga({ key: 'notification', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  styles
)(Notification);
