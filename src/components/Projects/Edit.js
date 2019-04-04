import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";

import { Form, Input, Row, Col, Button, Card } from "antd";
import Layout from "../Layout/index";

const { TextArea } = Input;

class EditView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.location.state.data.title || "",
      description: props.location.state.data.description || "",
      keywords: props.location.state.data.keywords || "",
      data: [],
      error: null,
      ...props.location.state
    };
  }

  onEditProject = event => {
    const { title, description, keywords, data } = this.state;
    let authUser = JSON.parse(localStorage.getItem("authUser"));
    console.log(title);
    console.log(data.key);
    this.props.firebase
      .project(authUser.uid)
      .child(data.key)
      .set({
        ...data,
        title,
        description,
        keywords,
        editedAt: this.props.firebase.serverValue.TIMESTAMP
      })
      .then(() => {
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
  componentDidMount() {
    //   const { param } = this.props.navigation.state.params;
    console.log("Helo" + this.state.data.title);
    console.log(this.state.data);
  }
  render() {
    const { data } = this.state;
    return (
      <Layout>
        <h1>Edit Project</h1>
        <p>Setup keyword to grab data for your analytics</p>
        <Card bordered={false}>
          <Row>
            <Col span={16}>
              <Form
                onSubmit={this.onEditProject}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 12 }}
              >
                <Form.Item label="Title">
                  <Input
                    name="title"
                    defaultValue={data.title}
                    onChange={this.onChange}
                    type="text"
                  />
                </Form.Item>
                <Form.Item label="Description">
                  <Input
                    name="description"
                    defaultValue={data.description}
                    onChange={this.onChange}
                    type="textarea"
                  />
                </Form.Item>
                <Form.Item label="Keywords">
                  <TextArea
                    name="keywords"
                    defaultValue={data.keywords}
                    onChange={this.onChange}
                    type="textarea"
                    rows={4}
                  />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col span={8}>
              <p>Guide</p>
            </Col>
          </Row>
        </Card>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

const condition = authUser => !!authUser;

export default compose(
  connect(mapStateToProps),
  withFirebase,
  withAuthorization(condition)
)(EditView);
