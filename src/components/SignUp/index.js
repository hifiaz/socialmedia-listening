import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Form, Input, Button } from "antd";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  isAdmin: false,
  error: null
};

const SignUpPage = () => (
  <div className="tengah">
    <h1>Sign Up</h1>
    <SignUpForm />
  </div>
);

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne, isAdmin } = this.state;
    const roles = [];

    if (isAdmin) {
      roles.push(ROLES.ADMIN);
    }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set(
          {
            username,
            email,
            roles
          },
          { merge: true }
        );
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      // isAdmin,
      error
    } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";
    return (
      <Form onSubmit={this.onSubmit} className="signup-form">
        <Form.Item>
          <Input
            name="username"
            value={username}
            onChange={this.onChange}
            type="text"
            placeholder="Full Name"
          />
        </Form.Item>
        <Form.Item>
          <Input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
        </Form.Item>
        <Form.Item>
          <Input
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Input
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Item>
        {/* <label>
          Admin:
          <input
            name="isAdmin"
            type="checkbox"
            checked={isAdmin}
            onChange={this.onChangeCheckbox}
          />
        </label> */}
        <Button
          disabled={isInvalid}
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          Sign Up
        </Button>

        {error && <p>{error.message}</p>}
      </Form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
