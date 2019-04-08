import React, { Component } from "react";

import { withFirebase } from "../Firebase";
import { Button, Input, Form, Alert } from "antd";

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
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
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

    return (
      <Form onSubmit={this.onSubmit} className="signup-form">
        <Form.Item>
          <Input
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="New Password"
          />
        </Form.Item>
        <Form.Item>
          <Input
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm New Password"
          />
        </Form.Item>
        <Button disabled={isInvalid} type="submit">
          Reset My Password
        </Button>

        {error && <Alert message={error.message} type="error" />}
      </Form>
    );
  }
}

export default withFirebase(PasswordChangeForm);
