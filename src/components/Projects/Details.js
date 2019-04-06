import React, { Component } from "react";
import { Tabs, PageHeader } from "antd";
import { connect } from "react-redux";
import { compose } from "recompose";

import { withAuthorization } from "../Session";

import Layout from "../Layout/index";
import Twitter from "./Pages/Twitter";
import Instagram from "./Pages/Instagram";
import News from "./Pages/News";

import * as ROUTES from "../../constants/routes";

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
        <PageHeader
          onBack={() => this.props.history.push(ROUTES.HOME)}
          title={this.state.data.title}
          subTitle={this.state.data.description}
        />
        <Tabs defaultActiveKey="1">
          <TabPane tab="Twitter" key="1">
            <Twitter />
          </TabPane>
          <TabPane tab="Instagram" key="2">
            <Instagram />
          </TabPane>
          <TabPane tab="News" key="3">
            <News />
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
