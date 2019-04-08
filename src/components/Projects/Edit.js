import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";

import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Card,
  Tag,
  Icon,
  notification
} from "antd";
import Layout from "../Layout/index";

const { TextArea } = Input;

class EditView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.location.state.data.title || "",
      description: props.location.state.data.description || "",
      tags: props.location.state.data.tags || [],
      data: [],
      error: null,
      inputVisible: false,
      ...props.location.state
    };
  }

  onEditProject = event => {
    const { title, description, data, tags } = this.state;
    let key = data.uid;
    let editedAt = Date.now();
    // console.log(key);
    this.props.firebase
      .projects()
      .doc(key)
      .set({
        ...data,
        title,
        description,
        tags,
        editedAt
      })
      .then(() => {
        notification["success"]({
          message: "Project successfully Edited!"
        });
      })
      .then(() => {
        this.props.history.push(ROUTES.LIST);
      })
      .catch(err => {
        console.log(err);
      });
    event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ keywords: e.target.value });
  };

  handleInputConfirm = () => {
    const { keywords } = this.state;
    let { tags } = this.state;
    if (keywords && tags.indexOf(keywords) === -1) {
      tags = [...tags, keywords];
    }
    this.setState({
      tags,
      inputVisible: false,
      keywords: ""
    });
  };

  saveInputRef = input => (this.input = input);
  forMap = tag => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          this.handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: "inline-block" }}>
        {tagElem}
      </span>
    );
  };
  render() {
    const { data, keywords, tags, inputVisible } = this.state;
    // console.log(data);
    const tagChild = tags.map(this.forMap);
    return (
      <Layout>
        <h1>Edit Project</h1>
        <p>Setup keyword to grab data for your analytics</p>
        <Card bordered={false}>
          <Row>
            <Col xs={24} md={16}>
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
                  <TextArea
                    name="description"
                    defaultValue={data.description}
                    onChange={this.onChange}
                    type="textarea"
                    rows={4}
                  />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                  <div style={{ marginBottom: 16 }}>{tagChild}</div>
                  {inputVisible && (
                    <Input
                      ref={this.saveInputRef}
                      type="text"
                      size="small"
                      style={{ width: 78 }}
                      value={keywords}
                      onChange={this.handleInputChange}
                      onBlur={this.handleInputConfirm}
                      onPressEnter={this.handleInputConfirm}
                    />
                  )}
                  {!inputVisible && (
                    <Tag
                      onClick={this.showInput}
                      style={{ background: "#fff", borderStyle: "dashed" }}
                    >
                      <Icon type="plus" /> New Keyword
                    </Tag>
                  )}
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Form>
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
