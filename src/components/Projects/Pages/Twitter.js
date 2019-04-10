import React, { Component } from "react";
import { Row, Col } from "antd";
import moment from "moment";

import { withAuthorization } from "../../Session";

import { connect } from "react-redux";
import { compose } from "recompose";
import algoliasearch from "algoliasearch";

import Cardtext from "../Charts/CardText";
import Cardtrend from "../Charts/CardTrend";
import Cardbar from "../Charts/CardBar";
import Cardprogress from "../Charts/CardProgress";
import Piechart from "../Charts/Pie";
import Wordcloud from "../Charts/Wordcloud";
import Tablechart from "../Charts/Twitter/Table";
import TableUser from "../Charts/Twitter/TableUser";
import Timelinechart from "../Charts/Timeline";
import LineChart from "../Charts/LineChart";

require("../lib/StopWords");

let applicationID = process.env.REACT_APP_ALGOLIA_ID;
let apiKey = process.env.REACT_APP_ALGOLIA_KEY;

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
    this._isMounted = true;
    this.client = algoliasearch(applicationID, apiKey);
    this.index = this.client.initIndex("twitter");
    this.index
      .search({
        query: this.state.data.tags[0]
      })
      .then(snapshot => {
        this.props.onSetTwitters(snapshot.hits);
        let data = snapshot.hits;

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
        let isBasicDataGrup = [];
        data.forEach(item => {
          let hourly = moment(item.created_at).format("HH:mm");
          const keyhour = hourly.slice(0, 2);
          isBasicDataGrup.push({ id: item.id, hour: keyhour });
        });
        //function grouping
        function groupBy(list, keyGetter) {
          const map = new Map();
          list.forEach(item => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
              map.set(key, [item]);
            } else {
              collection.push(item);
            }
          });
          return map;
        }
        // execution grouping
        const grouped = groupBy(isBasicDataGrup, item => item.hour);
        const isGroup = [];
        let today = new Date();
        let oldToday = moment(today).format("L");
        grouped.forEach(element => {
          let tominute = element[0].hour * 60;
          var newDateObj = moment(oldToday)
            .add(tominute, "m")
            .toDate();
          let convertDate = newDateObj.getTime() + 1000 * 59;
          isGroup.push({
            x: convertDate,
            y1: element.length
          });
        });

        this.setState({
          loading: false,
          totalData: data.length,
          totalUser: isUserData.length,
          totalWord: kata.length,
          totalImpression: isTotalImpression,
          chartTimeline: isGroup,
          chartSentiment: sentiment,
          chartWordcloud: kata,
          tableUser: isUserData,
          chartTabel: data,
          impression: impression,
          chartSource: source
        });
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
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
          <Col xs={24} md={6} style={{ marginBottom: 24 }}>
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
        <Row gutter={24}>
          <Col xs={24} md={12} style={{ marginBottom: 24 }}>
            <Piechart
              chartSentiment={this.state.chartSentiment}
              loading={this.state.loading}
            />
          </Col>
          <Col xs={24} md={12}>
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
