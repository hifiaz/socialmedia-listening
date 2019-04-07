import React, { Component } from "react";
import { Row, Col } from "antd";
import moment from "moment";
import _ from "lodash";

import { withAuthorization } from "../../Session";

import { connect } from "react-redux";
import { compose } from "recompose";

import Cardtext from "../Charts/CardText";
import Cardtrend from "../Charts/CardTrend";
import Cardbar from "../Charts/CardBar";
import Cardprogress from "../Charts/CardProgress";
import Piechart from "../Charts/Pie";
import Wordcloud from "../Charts/Wordcloud";
import Tablechart from "../Charts/TableYt";
import TableUser from "../Charts/TableYtUser";
// import Barchart from "../Charts/Bar";
// import Timelinechart from "../Charts/Timeline";
import LineChart from "../Charts/LineChart";

require("../lib/StopWords");

class YoutubePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      chartTabel: [],
      // tableUser: [],
      totalData: "",
      totalUser: "",
      totalWord: "",
      totalImpression: "",
      chartSentiment: [],
      // chartSource: [],
      chartTimeline: [],
      chartWordcloud: [],
      impression: [],
      ...props.location.state
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.unsubscribe = this.props.firebase.youtubes().onSnapshot(snapshot => {
      if (snapshot.size) {
        let data = [];
        snapshot.forEach(doc => {
          data.push({ ...doc.data(), uid: doc.id });
        });
        this.props.onSetTwitters(data);

        data.sort(
          (a, b) =>
            parseFloat(b.views) -
            parseFloat(a.views)
        );

        // parsing to wordcloud
        let isTextFull = [];
        let isSumOfWord = {};
        let kata = [];
        data.forEach(item => {
          isTextFull.push(item.description);
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

        // Parsing to sentiment
        let negative = data.filter(value => value.sentiment === "negative");
        let neutral = data.filter(value => value.sentiment === "neutral");
        let positive = data.filter(value => value.sentiment === "positive");
        const sentiment = [
          { x: "negative", y: negative.length },
          { x: "neutral", y: neutral.length },
          { x: "positive", y: positive.length }
        ];

        // // partsing to table user
        let isUserData = data.filter(value => {
          return !this[value.channel] && (this[value.channel] = true);
        }, Object.create(null));

        // impression
        let impression = data.map(item => ({
          x: item.channel,
          y: item.views
        }));

        // Total impression
        let totalImpression = data.map(item => item.views);
        let isTotalImpression = totalImpression.reduce((a, b) => a + b, 0);

        // Group data
        const isKeyFilter = item => moment(item.created_at).format("llll");
        // const isKeyFilter = item => item.created_at;
        const isGroupData = _.groupBy(data, isKeyFilter);
        var isGroup = Object.keys(isGroupData).map(key => {
          return { x: moment(key).unix(), y1: isGroupData[key].length };
        });

        this.setState({
          chartTabel: data,
          tableUser: isUserData,
          totalData: data.length,
          totalUser: isUserData.length,
          totalWord: kata.length,
          totalImpression: isTotalImpression,
          chartTimeline: isGroup,
          chartSentiment: sentiment,
          // chartSource: source,
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
        <Row gutter={24}>
          <Col xs={24} md={6} style={{ marginBottom: 24 }}>
            <Cardtext
              totalData={this.state.totalData}
              loading={this.state.loading}
            />
          </Col>
          <Col xs={24} md={6} style={{ marginBottom: 24 }}>
            <Cardtrend
              totalUser={this.state.totalUser}
              loading={this.state.loading}
            />
          </Col>
          <Col xs={24} md={6} style={{ marginBottom: 24 }}>
            <Cardbar
              totalWord={this.state.totalWord}
              loading={this.state.loading}
            />
          </Col>
          <Col xs={24} md={6}>
            <Cardprogress
              totalImpression={this.state.totalImpression}
              loading={this.state.loading}
            />
          </Col>
        </Row>
        {/* <Row>
          <Col span={24} style={{ marginBottom: 24 }}>
            <Timelinechart
              chartTimeline={this.state.chartTimeline}
              loading={this.state.loading}
            />
          </Col>
        </Row> */}
        <Row gutter={24}>
          <Col xs={24} md={12} style={{ marginBottom: 24 }}>
            <Piechart
              chartSentiment={this.state.chartSentiment}
              loading={this.state.loading}
            />
          </Col>
          <Col xs={24} md={12} style={{ marginBottom: 24 }}>
            <Wordcloud
              chartWordcloud={this.state.chartWordcloud}
              loading={this.state.loading}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} md={24} lg={12} style={{ marginBottom: 24 }}>
            <TableUser
              tableUser={this.state.tableUser}
              loading={this.state.loading}
            />
          </Col>
          <Col xs={24} md={12} style={{ marginBottom: 24 }}>
            <LineChart
              impression={this.state.impression}
              loading={this.state.loading}
            />
            {/* <Barchart
              impression={this.state.impression}
              loading={this.state.loading}
            /> */}
            {/* <Piechart
              chartSentiment={this.state.chartSource}
              loading={this.state.loading}
            /> */}
          </Col>
        </Row>
        <Tablechart
          chartTabel={this.state.chartTabel}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  twitters: Object.keys(state.twitterState.projects || {}).map(key => ({
    ...state.twitterState.twitters[key]
  }))
});

const mapDispatchToProps = dispatch => ({
  onSetTwitters: twitters => dispatch({ type: "TWITTER_SET", twitters })
});

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(YoutubePage);
