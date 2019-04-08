import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";

import { Form, Input, Row, Col, Button, Card, Tag, Icon } from "antd";
import Layout from "../Layout/index";

const { TextArea } = Input;

const INITIAL_STATE = {
  title: "",
  description: "",
  keywords: "",
  error: null,
  tags: [],
  inputVisible: false
};

class AddView extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { title, description, tags } = this.state;
    let authUser = JSON.parse(localStorage.getItem("authUser"));
    let isUser = authUser.uid;
    let createdAt = Date.now();
    this.props.firebase
      .projects()
      .doc()
      .set({
        createdAt,
        isUser,
        title,
        description,
        tags
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
    const {
      title,
      description,
      tags,
      inputVisible,
      keywords,
      error
    } = this.state;

    const isInvalid = title === "";

    const tagChild = tags.map(this.forMap);

    return (
      <Layout>
        <h1>Add</h1>
        <p>Setup keyword to grab data for your analytics</p>
        <Card bordered={false}>
          <Row>
            <Col xs={24} md={8}>
              <p>Guide</p>
              <p>
                <i>Title:</i> Isikan judul secara singkat dan mempresentasikan
                project
              </p>
              <p>
                <i>Description:</i> Deskripsikan project ini dengan jelas,
                seperti apa yang akan di analisa, goal seperti apa yang di
                harapkan, hal ini bertujuan untuk memberitahu sistem untuk
                menarik data secara efektif
              </p>
              <p>
                <i>New Keyword:</i> Dalam menulis keyword pastikan anda tau goal
                apa yang akan di capai, jika bersifat general gunakan keyword
                yang banyak di gunakan orang, contoh ketika saya ingin
                memonitoring bank, cukup gunakan keyword "Bank", jika ingin
                spesifik pada bank tertentu bisa gunakan contoh keyword "Bank
                Mandiri"
              </p>
            </Col>
            <Col xs={24} md={16}>
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
                  <TextArea
                    name="description"
                    value={description}
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
                  <Button disabled={isInvalid} type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
                {error && <p>{error.message}</p>}
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
)(AddView);
