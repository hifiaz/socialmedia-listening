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
import CardMedia from "../Charts/News/UniqueMedia";
import Piechart from "../Charts/Pie";
import Wordcloud from "../Charts/Wordcloud";
import TableNews from "../Charts/News/TableNews";
import TableMedia from "../Charts/News/TableNMedia";
import TableUser from "../Charts/News/TableNUser";
import Timelinechart from "../Charts/Timeline";

require("../lib/StopWords");

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      totalData: "",
      totalUser: "",
      totalWord: "",
      totalMedia: "",
      chartTimeline: [],
      chartSentiment: [],
      chartWordcloud: [],
      tableMedia: [],
      TableUser: [],
      chartTabel: [],
      ...props.location.state
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.setState({ loading: true });

    this.client = algoliasearch(
      process.env.REACT_APP_ALGOLIA_ID,
      process.env.REACT_APP_ALGOLIA_KEY
    );
    this.index = this.client.initIndex("news");
    this.index
      .search({
        query: this.state.data.tags[0]
      })
      .then(snapshot => {
        this.props.onSetNews(snapshot.hits);
        let data = snapshot.hits;
        let totalData = data.length;

        // define lenght user
        let isUserData = data.filter(value => {
          return !this[value.author] && (this[value.author] = true);
        }, Object.create(null));

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

        // Lenght of Media
        let isMediaData = data.filter(value => {
          return !this[value.source.name] && (this[value.source.name] = true);
        }, Object.create(null));

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

        // Parsing to sentiment
        let negative = data.filter(value => value.sentiment === "negative");
        let neutral = data.filter(value => value.sentiment === "neutral");
        let positive = data.filter(value => value.sentiment === "positive");
        const sentiment = [
          { x: "negative", y: negative.length },
          { x: "neutral", y: neutral.length },
          { x: "positive", y: positive.length }
        ];

        this.setState({
          totalData,
          totalUser: isUserData.length,
          totalWord: kata.length,
          totalMedia: isMediaData.length,
          chartTimeline: isGroup,
          chartSentiment: sentiment,
          chartWordcloud: kata,
          tableMedia: isMediaData,
          tableUser: isUserData,
          chartTabel: data
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
          <Col span={6} style={{ marginBottom: 24 }}>
            <Cardtext
              totalData={this.state.totalData}
              // loading={this.state.loading}
            />
          </Col>
          <Col span={6} style={{ marginBottom: 24 }}>
            <Cardtrend
              totalUser={this.state.totalUser}
              // loading={this.state.loading}
            />
          </Col>
          <Col span={6} style={{ marginBottom: 24 }}>
            <Cardbar
              totalWord={this.state.totalWord}
              // loading={this.state.loading}
            />
          </Col>
          <Col span={6} style={{ marginBottom: 24 }}>
            <CardMedia
              totalMedia={this.state.totalMedia}
              // loading={this.state.loading}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginBottom: 24 }}>
            <Timelinechart
              chartTimeline={this.state.chartTimeline}
              loading={this.state.loading}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12} style={{ marginBottom: 24 }}>
            <Piechart
              chartSentiment={this.state.chartSentiment}
              // loading={this.state.loading}
            />
          </Col>
          <Col span={12} style={{ marginBottom: 24 }}>
            <Wordcloud
              chartWordcloud={this.state.chartWordcloud}
              // loading={this.state.loading}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col md={12} style={{ marginBottom: 24 }}>
            <TableMedia
              tableMedia={this.state.tableMedia}
              // loading={this.state.loading}
            />
          </Col>
          <Col md={12} style={{ marginBottom: 24 }}>
            <TableUser
              tableUser={this.state.tableUser}
              // loading={this.state.loading}
            />
          </Col>
        </Row>
        <TableNews
          chartTabel={this.state.chartTabel}
          // loading={this.state.loading}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  news: Object.keys(state.newsState.news || {}).map(key => ({
    ...state.newsState.news[key]
  }))
});

const mapDispatchToProps = dispatch => ({
  onSetNews: news => dispatch({ type: "NEWS_SET", news })
});

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(News);
