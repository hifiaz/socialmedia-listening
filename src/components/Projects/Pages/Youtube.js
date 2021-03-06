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
import Tablechart from "../Charts/Youtube/TableYt";
import TableUser from "../Charts/Youtube/TableYtUser";
// import Barchart from "../Charts/Bar";
// import Timelinechart from "../Charts/Timeline";
import LineChart from "../Charts/LineChart";

require("../lib/StopWords");

class YoutubePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      totalData: "",
      totalUser: "",
      totalWord: "",
      totalImpression: "",
      chartTabel: [],
      chartSentiment: [],
      chartTimeline: [],
      chartWordcloud: [],
      impression: [],
      ...props.location.state
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.client = algoliasearch(
      process.env.REACT_APP_ALGOLIA_ID,
      process.env.REACT_APP_ALGOLIA_KEY
    );
    this.index = this.client.initIndex("youtube");
    this.index
      .search({
        query: this.state.data.tags[0]
      })
      .then(snapshot => {
        if (snapshot != null) {
          this.props.onSetTwitters(snapshot.hits);
          let data = snapshot.hits;

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
            chartTabel: data,
            tableUser: isUserData,
            chartTimeline: isGroup,
            chartSentiment: sentiment,
            chartWordcloud: kata,
            impression: impression
          });
        }
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
          <Col xs={24} md={6}>
            <Cardprogress
              totalImpression={this.state.totalImpression}
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
