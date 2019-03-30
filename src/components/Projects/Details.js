import React, { Component } from "react";

import { withAuthorization } from "../Session";

import { Typography, Row, Col } from "antd";
import Layout from "../Layout/index";
import Cardtext from "./Charts/CardText";
import Cardtrend from "./Charts/CardTrend";
import Cardbar from "./Charts/CardBar";
import Cardprogress from "./Charts/CardProgress";
import Piechart from "./Charts/Pie";
import Wordcloud from "./Charts/Wordcloud";
import Tablechart from "./Charts/Table";
import Barchart from "./Charts/Bar";
import Timelinechart from "./Charts/Timeline";

const { Title, Paragraph } = Typography;

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
          <Title level={2}>{this.state.data.title}</Title>
          <Paragraph>{this.state.data.description}</Paragraph>
          <Row gutter={16} style={{ marginBottom: 12 }}>
            <Col span={6}>
              <Cardtext />
            </Col>
            <Col span={6}>
              <Cardtrend />
            </Col>
            <Col span={6}>
              <Cardbar />
            </Col>
            <Col span={6}>
              <Cardprogress />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 12 }}>
            <Col span={12}>
              <Piechart />
            </Col>
            <Col span={12}>
              <Wordcloud />
            </Col>
          </Row>
          <Row style={{ marginBottom: 12 }}>
            <Col span={24}>
              <Timelinechart />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 12 }}>
            <Col span={12}>
              <Tablechart />
            </Col>
            <Col span={12}>
              <Barchart />
            </Col>
          </Row>
      </Layout>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ProjectDetails);
