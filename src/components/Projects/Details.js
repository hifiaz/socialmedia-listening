import React, { Component } from "react";

import { withAuthorization } from "../Session";

import { Typography, Row, Col, List } from "antd";
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
      chartTabel: [],
      chartText: "",
      chartSentiment: [],
      chartTimeline: [],
      chartWordcloud: [],
      ...props.location.state
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    let data;

    this.props.firebase
      .twitters()
      .limitToLast(15)
      .on("value", snapshot => {
        if (snapshot.exists()) {
          const projectObject = snapshot.val();
          data = Object.keys(projectObject).map(key => ({
            ...projectObject[key],
            key: key
          }));
        }

        // parsing to wordcloud
        let textfull = [];
        let counts = {};
        let kata = [];

        data.forEach(item => {
          textfull.push(item.text);
        });
        let allword = textfull.join("\n");
        let token = allword.split(/\W+/);
        token.forEach(word => {
          if (counts[word] === undefined) {
            counts[word] = 1;
          } else {
            counts[word] = counts[word] + 1;
          }
        });
        kata = Object.keys(counts).map(key => ({
          ...counts[key],
          name: key,
          value: counts[key]
        }));
        // console.log(kata);

        let negative = data.filter(value => value.sentiment === "negative");
        let neutral = data.filter(value => value.sentiment === "neutral");
        let positive = data.filter(value => value.sentiment === "positive");
        const sentiment = [
          { x: "negative", y: negative.length },
          { x: "neutral", y: neutral.length },
          { x: "positive", y: positive.length }
        ];
        //belum bisa dapet datanya
        const timeline = [{ x: data.created_at, y1: data.length }];
        console.log(data);
        // console.log(timeline);
        this.setState({
          chartTabel: data,
          chartText: data.length,
          chartTimeline: timeline,
          chartSentiment: sentiment,
          chartWordcloud: kata,
          loading: false
        });
      });
  }

  componentWillUnmount() {
    this.props.firebase.twitter().off();
  }
  render() {
    return (
      <Layout>
        <Title level={2}>{this.state.data.title}</Title>
        <Paragraph>{this.state.data.description}</Paragraph>
        <Row gutter={16} style={{ marginBottom: 12 }}>
          <Col span={6}>
            <Cardtext chartText={this.state.chartText} />
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
            <Piechart chartSentiment={this.state.chartSentiment} />
          </Col>
          <Col span={12}>
            <Wordcloud chartWordcloud={this.state.chartWordcloud} />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={24}>
            <Timelinechart />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: 12 }}>
          <Col span={16}>
            
          </Col>
          <Col span={8}>
            <Barchart chartSentiment={this.state.chartSentiment} />
          </Col>
        </Row>
        <Tablechart chartTabel={this.state.chartTabel} />
      </Layout>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ProjectDetails);
