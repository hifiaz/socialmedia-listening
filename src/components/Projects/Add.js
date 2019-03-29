import React, { Component } from "react";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { AuthUserContext } from "../Session";

import { Form, Input, Row, Col, Button } from "antd";
import Layout from "../Layout/index";

const { TextArea } = Input;

const INITIAL_STATE = {
  title: "",
  description: "",
  keywords: "",
  error: null
};

class AddView extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { title, description, keywords } = this.state;
    let authUser = JSON.parse(localStorage.getItem("authUser"));
    this.props.firebase
      .project(authUser.uid)
      .push({
        title,
        description,
        keywords
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.LIST);
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
    const { title, description, keywords, error } = this.state;

    const isInvalid = title === "" || keywords === "";
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <Layout>
            <h1>Add</h1>
            <p>Setup keyword to grab data for your analytics</p>
            <Row gutter={16}>
              <Col span={16}>
                <Form onSubmit={this.onSubmit} layout="vertical">
                  <Form.Item label="Title">
                    <Input
                      name="title"
                      value={title}
                      onChange={this.onChange}
                      type="text"
                    />
                  </Form.Item>
                  <Form.Item label="Description">
                    <Input
                      name="description"
                      value={description}
                      onChange={this.onChange}
                      type="textarea"
                    />
                  </Form.Item>
                  <Form.Item label="Keywords">
                    <TextArea
                      name="keywords"
                      value={keywords}
                      onChange={this.onChange}
                      type="textarea"
                      rows={4}
                    />
                  </Form.Item>
                  <Button disabled={isInvalid} type="primary" htmlType="submit">
                    Save
                  </Button>
                  {error && <p>{error.message}</p>}
                </Form>
              </Col>
              <Col span={8}>
                <p>Guide</p>
              </Col>
            </Row>
          </Layout>
        )}
      </AuthUserContext.Consumer>
    );
  }
}
// const condition = authUser => !!authUser;

// const AddDataForm = compose(
//   withAuthorization,
//   withFirebase
// )(AddView);

export default withFirebase(AddView);
