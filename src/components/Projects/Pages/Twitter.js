import React, { Component } from "react";
import moment from "moment";
import _ from "lodash";

import { withAuthorization } from "../../Session";

import { connect } from "react-redux";
import { compose } from "recompose";

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
      loading: true,
      chartTabel: [],
      tableUser: [],
      totalData: "",
      totalUser: "",
      totalWord: "",
      totalImpression: "",
      chartSentiment: [],
      chartSource: [],
      chartTimeline: [],
      chartWordcloud: [],
      impression: [],
      ...props.location.state
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.unsubscribe = this.props.firebase.twitters().onSnapshot(snapshot => {
      if (snapshot.size) {
        // data = Object.keys(snapshot).map(key => ({
        //   ...snapshot[key],
        //   key: key
        // }));
        let data = [];
        snapshot.forEach(doc => {
          data.push({ ...doc.data(), uid: doc.id });
        });
        this.props.onSetTwitters(data);

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

        // Source
        let srcAndroid = data.filter(
          value =>
            value.source ===
            '<a href="http://twitter.com/download/android" rel="nofollow">Twitter for Android</a>'
        );
        let srcWeb = data.filter(
          value =>
            value.source ===
            '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>'
        );
        let srcIphone = data.filter(
          value =>
            value.source ===
            '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>'
        );
        let srcTweetDeck = data.filter(
          value =>
            value.source ===
            '<a href="https://about.twitter.com/products/tweetdeck" rel="nofollow">TweetDeck</a>'
        );
        let srcOther = data.filter(
          value =>
            value.source !== srcAndroid || srcWeb || srcIphone || srcTweetDeck
        );
        const source = [
          { x: "Android", y: srcAndroid.length },
          { x: "Web", y: srcWeb.length },
          { x: "Iphone", y: srcIphone.length },
          { x: "TweetDeck", y: srcTweetDeck.length },
          { x: "Other", y: srcOther.length }
        ];

        // partsing to table user
        let isUserData = data.filter(value => {
          return !this[value.user.id] && (this[value.user.id] = true);
        }, Object.create(null));

        // impression
        let impression = data.map(item => ({
          x: item.user.screen_name,
          y: item.user.followers_count
        }));

        // Total impression
        let totalImpression = data.map(item => item.user.followers_count);
        let isTotalImpression = totalImpression.reduce((a, b) => a + b, 0);

        // Group data
        const isKeyFilter = item => moment(item.created_at).format("llll");
        // const isKeyFilter = item => item.created_at;
        const isGroupData = _.groupBy(data, isKeyFilter);
        var isGroup = Object.keys(isGroupData).map(key => {
          return { x: moment(key).unix(), y1: isGroupData[key].length };
        });
        console.log(isGroupData);

        this.setState({
          chartTabel: data,
          tableUser: isUserData,
          totalData: data.length,
          totalUser: isUserData.length,
          totalWord: kata.length,
          totalImpression: isTotalImpression,
          chartTimeline: isGroup,
          chartSentiment: sentiment,
          chartSource: source,
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
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Cardtext
              totalData={this.state.totalData}
              loading={this.state.loading}
            />
          </Col>
          <Col span={6}>
            <Cardtrend
              totalUser={this.state.totalUser}
              loading={this.state.loading}
            />
          </Col>
          <Col span={6}>
            <Cardbar
              totalWord={this.state.totalWord}
              loading={this.state.loading}
            />
          </Col>
          <Col span={6}>
            <Cardprogress
              totalImpression={this.state.totalImpression}
              loading={this.state.loading}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={24} style={{ marginBottom: 24 }}>
            <Timelinechart
              chartTimeline={this.state.chartTimeline}
              loading={this.state.loading}
            />
          </Col>
        </Row>
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Piechart
              chartSentiment={this.state.chartSentiment}
              loading={this.state.loading}
            />
          </Col>
          <Col span={12}>
            <Wordcloud
              chartWordcloud={this.state.chartWordcloud}
              loading={this.state.loading}
            />
          </Col>
        </Row>
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <TableUser
              tableUser={this.state.tableUser}
              loading={this.state.loading}
            />
          </Col>
          <Col span={12} style={{ marginBottom: 24 }}>
            <Barchart
              impression={this.state.impression}
              loading={this.state.loading}
            />
            <Piechart
              chartSentiment={this.state.chartSource}
              loading={this.state.loading}
            />
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
)(ProjectDetails);
