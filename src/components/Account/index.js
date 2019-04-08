import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Button, Row, Col, Card, Form, Input, Upload, Icon } from "antd";
import Layout from "../Layout/index";

import { withAuthorization, withEmailVerification } from "../Session";
import { withFirebase } from "../Firebase";
import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";
const { Meta } = Card;
const ButtonGroup = Button.Group;

const SIGN_IN_METHODS = [
  {
    id: "password",
    provider: null
  },
  {
    id: "google.com",
    provider: "googleProvider"
  },
  {
    id: "facebook.com",
    provider: "facebookProvider"
  },
  {
    id: "twitter.com",
    provider: "twitterProvider"
  }
];

const AccountPage = ({ authUser }) =>
  console.log(authUser) || (
    <Layout>
      <Card>
        <Row>
          <Col span={8}>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <img
                  alt="example"
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
              }
            >
              <Meta title={authUser.username} description={authUser.email} />
            </Card>
          </Col>
          <Col span={16}>
            <Upload>
              <Button style={{ marginBottom: "1rem" }}>
                <Icon type="upload" /> Click to Upload
              </Button>
            </Upload>
            <PasswordForgetForm />
            <PasswordChangeForm />
            <LoginManagement authUser={authUser} />
          </Col>
        </Row>
      </Card>
    </Layout>
  );

class LoginManagementBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSignInMethods: [],
      error: null
    };
  }

  componentDidMount() {
    this.fetchSignInMethods();
  }

  fetchSignInMethods = () => {
    this.props.firebase.auth
      .fetchSignInMethodsForEmail(this.props.authUser.email)
      .then(activeSignInMethods =>
        this.setState({ activeSignInMethods, error: null })
      )
      .catch(error => this.setState({ error }));
  };

  onSocialLoginLink = provider => {
    this.props.firebase.auth.currentUser
      .linkWithPopup(this.props.firebase[provider])
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  onDefaultLoginLink = password => {
    const credential = this.props.firebase.emailAuthProvider.credential(
      this.props.authUser.email,
      password
    );

    this.props.firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  onUnlink = providerId => {
    this.props.firebase.auth.currentUser
      .unlink(providerId)
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  render() {
    const { activeSignInMethods, error } = this.state;

    return (
      <div>
        <h1 style={{ marginTop: "1em" }}>Sign In Methods:</h1>
        {SIGN_IN_METHODS.map(signInMethod => {
          const onlyOneLeft = activeSignInMethods.length === 1;
          const isEnabled = activeSignInMethods.includes(signInMethod.id);
          return (
            <ButtonGroup key={signInMethod.id}>
              {signInMethod.id === "password" ? (
                <DefaultLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={this.onDefaultLoginLink}
                  onUnlink={this.onUnlink}
                />
              ) : (
                <SocialLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={this.onSocialLoginLink}
                  onUnlink={this.onUnlink}
                />
              )}
            </ButtonGroup>
          );
        })}
        {error && error.message}
      </div>
    );
  }
}

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink
}) =>
  isEnabled ? (
    <Button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
      style={{ marginRight: "1rem" }}
    >
      Deactivate {signInMethod.id}
    </Button>
  ) : (
    <Button
      type="button"
      onClick={() => onLink(signInMethod.provider)}
      style={{ marginRight: "1rem" }}
    >
      {signInMethod.id}
    </Button>
  );

class DefaultLoginToggle extends Component {
  constructor(props) {
    super(props);

    this.state = { passwordOne: "", passwordTwo: "" };
  }

  onSubmit = event => {
    event.preventDefault();

    this.props.onLink(this.state.passwordOne);
    this.setState({ passwordOne: "", passwordTwo: "" });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { onlyOneLeft, isEnabled, signInMethod, onUnlink } = this.props;

    const { passwordOne, passwordTwo } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

    return isEnabled ? (
      <Button
        type="button"
        onClick={() => onUnlink(signInMethod.id)}
        disabled={onlyOneLeft}
        style={{ marginRight: "1rem" }}
      >
        Deactivate {signInMethod.id}
      </Button>
    ) : (
      <Form onSubmit={this.onSubmit}>
        <Input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="New Password"
        />
        <Input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm New Password"
        />

        <Button
          disabled={isInvalid}
          type="submit"
          style={{ marginRight: "1rem" }}
        >
          {signInMethod.id}
        </Button>
      </Form>
    );
  }
}

const LoginManagement = withFirebase(LoginManagementBase);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

const condition = authUser => !!authUser;

export default compose(
  connect(mapStateToProps),
  withEmailVerification,
  withAuthorization(condition)
)(AccountPage);
