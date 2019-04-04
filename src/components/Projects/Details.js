import React, { Component } from "react";
import { Tabs } from "antd";
import { connect } from "react-redux";
import { compose } from "recompose";

import { withAuthorization } from "../Session";

import Layout from "../Layout/index";
import Twitter from "./Pages/Twitter";

require("./lib/StopWords");

const TabPane = Tabs.TabPane;

class ProjectDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: null,
      ...props.location.state
    };
  }
  render() {
    return (
      <Layout>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Twitter" key="1">
            <Twitter />
          </TabPane>
          <TabPane tab="Instagram" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="News" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
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
  withAuthorization(condition)
)(ProjectDetails);
