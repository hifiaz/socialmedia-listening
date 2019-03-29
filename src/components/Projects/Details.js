import React, { Component } from "react";

import { withAuthorization } from "../Session";

import { Typography } from "antd";
import Layout from "../Layout/index";

const { Title } = Typography;

class ProjectDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: null,
      ...props.location.state
    };
  }
  componentDidMount() {
    console.log(this.state.data);
  }
  render() {
    return (
      <Layout>
        <Title>{this.state.data.title}</Title>
        <p>All projects will display in here</p>
      </Layout>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ProjectDetails);
