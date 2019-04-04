import React, { Component } from "react";

import { withAuthorization } from "../../Session";

import { Typography, Row, Col } from "antd";
import Cardtext from "../Charts/CardText";
import Cardtrend from "../Charts/CardTrend";
import Cardbar from "../Charts/CardBar";
import Cardprogress from "../Charts/CardProgress";
import Piechart from "../Charts/Pie";
import Wordcloud from "../Charts/Wordcloud";
import Tablechart from "../Charts/Table";
import TableUser from "../Charts/TableUser";
import Barchart from "../Charts/Bar";
import Timelinechart from "../Charts/Timeline";

require("../lib/StopWords");

const { Title, Paragraph } = Typography;

class ProjectDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: null,
      chartTabel: [],
      tableUser: [],
      totalData: "",
      totalUser: "",
      totalWord: "",
      chartSentiment: [],
      chartTimeline: [],
      chartWordcloud: [],
      impression: [],
      ...props.location.state
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    let data;

    this.unsubscribe = this.props.firebase.twitters().onSnapshot(snapshot => {
      if (snapshot.size) {
        const projectObject = snapshot.val();
        data = Object.keys(projectObject).map(key => ({
          ...projectObject[key],
          key: key
        }));
        data.sort(
          (a, b) =>
            parseFloat(b.user.followers_count) -
            parseFloat(a.user.followers_count)
        );

        // parsing to wordcloud
        let isTextFull = [];
        let isSumOfWord = {};
        let kata = [];
        data.forEach(item => {
          isTextFull.push(item.text);
        });

        let isAllWord = isTextFull.join("\n");
        let removeWord = isAllWord.removeStopWords();
        let token = removeWord.split(/\W+/);
        token.forEach(word => {
          if (isSumOfWord[word] === undefined) {
            isSumOfWord[word] = 1;
          } else {
            isSumOfWord[word] = isSumOfWord[word] + 1;
          }
        });
        kata = Object.keys(isSumOfWord).map(key => ({
          ...isSumOfWord[key],
          name: key,
          value: isSumOfWord[key]
        }));

        // console.log(kata);
        // Parsing to sentiment
        let negative = data.filter(value => value.sentiment === "negative");
        let neutral = data.filter(value => value.sentiment === "neutral");
        let positive = data.filter(value => value.sentiment === "positive");
        const sentiment = [
          { x: "negative", y: negative.length },
          { x: "neutral", y: neutral.length },
          { x: "positive", y: positive.length }
        ];

        //parsing to timeline belum bisa dapet datanya
        const timeline = [{ x: data.created_at, y1: data.length }];

        // partsing to table user
        let isUserData = data.filter(value => {
          return !this[value.user.id] && (this[value.user.id] = true);
        }, Object.create(null));

        // impression
        let impression = data.map(item => ({
          x: item.user.screen_name,
          y: item.user.followers_count
        }));

        console.log(data);

        this.setState({
          chartTabel: data,
          tableUser: isUserData,
          totalData: data.length,
          totalUser: isUserData.length,
          totalWord: kata.length,
          chartTimeline: timeline,
          chartSentiment: sentiment,
          chartWordcloud: kata,
          impression: impression,
          loading: false
        });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    return (
      <div>
        <Title level={2}>{this.state.data.title}</Title>
        <Paragraph>{this.state.data.description}</Paragraph>
        <Row gutter={16} style={{ marginBottom: 12 }}>
          <Col span={6}>
            <Cardtext totalData={this.state.totalData} />
          </Col>
          <Col span={6}>
            <Cardtrend totalUser={this.state.totalUser} />
          </Col>
          <Col span={6}>
            <Cardbar totalWord={this.state.totalWord} />
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
          <Col span={12}>
            <TableUser tableUser={this.state.tableUser} />
          </Col>
          <Col span={12}>
            <Barchart impression={this.state.impression} />
          </Col>
        </Row>
        <Tablechart chartTabel={this.state.chartTabel} />
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ProjectDetails);
