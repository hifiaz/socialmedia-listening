import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Button } from "antd";

import { withFirebase } from "../Firebase";

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes("password");

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return needsEmailVerification(this.props.authUser) ? (
        <div className="tengah">
          {this.state.isSent ? (
            <p>
              E-Mail confirmation sent: Check your E-Mails (Spam folder
              included) for a confirmation E-Mail. Refresh this page once you
              confirmed your E-Mail.
            </p>
          ) : (
            <p>
              Verify your E-Mail: Check your E-Mails (Spam folder included) for
              a confirmation E-Mail or send another confirmation E-Mail.
            </p>
          )}

          <Button
            type="button"
            onClick={this.onSendEmailVerification}
            disabled={this.state.isSent}
          >
            Send confirmation E-Mail
          </Button>
        </div>
      ) : (
        <Component {...this.props} />
      );
    }
  }

  const mapStateToProps = state => ({
    authUser: state.sessionState.authUser
  });

  return compose(
    withFirebase,
    connect(mapStateToProps)
  )(WithEmailVerification);
};

export default withEmailVerification;
