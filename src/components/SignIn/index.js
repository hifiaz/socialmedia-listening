import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Form, Icon, Input, Button } from "antd";

import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const SignInPage = () => (
  <div className="tengah">
    <h1>Sign In</h1>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;
    
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
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

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <Form onSubmit={this.onSubmit} className="login-form">
        <Form.Item>
          <Input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
          />
        </Form.Item>
        <Form.Item>
          <Input
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
          />
        </Form.Item>
        <Button disabled={isInvalid} type="primary" htmlType="submit" className="login-form-button">
          Sign In
        </Button>

        {error && <p>{error.message}</p>}
      </Form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
