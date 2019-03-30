import React, { Component } from "react";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { AuthUserContext } from "../Session";

import { Form, Input, Row, Col, Button, Card } from "antd";
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
        createdAt: this.props.firebase.serverValue.TIMESTAMP,
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

  onEditProject = (message, text) => {
    this.props.firebase.message(message.uid).set({
      ...message,
      text,
      editedAt: this.props.firebase.serverValue.TIMESTAMP
    });
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
            <Card bordered={false}>
              <Row>
                <Col span={16}>
                  <Form
                    onSubmit={this.onSubmit}
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 12 }}
                  >
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
                    <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                      <Button
                        disabled={isInvalid}
                        type="primary"
                        htmlType="submit"
                      >
                        Save
                      </Button>
                    </Form.Item>
                    {error && <p>{error.message}</p>}
                  </Form>
                </Col>
                <Col span={8}>
                  <p>Guide</p>
                </Col>
              </Row>
            </Card>
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