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
      chartTabel: [],
      totalData: "",
      totalUser: "",
      totalWord: "",
      totalMedia: "",
      chartSentiment: [],
      chartTimeline: [],
      chartWordcloud: [],
      tableMedia: [],
      TableUser: [],
      impression: [],
      ...props.location.state
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.unsubscribe = this.props.firebase.news().onSnapshot(snapshot => {
      if (snapshot.size) {
        let data = [];
        snapshot.forEach(doc => {
          data.push({ ...doc.data(), uid: doc.id });
        });
        this.props.onSetNews(data);

        data.sort(
          (a, b) => parseFloat(b.created_at) - parseFloat(a.created_at)
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

        // Uniq User / Author
        let isUserData = data.filter(value => {
          return !this[value.author] && (this[value.author] = true);
        }, Object.create(null));

        // Unique Media
        let isMediaData = data.filter(value => {
          return !this[value.source.name] && (this[value.source.name] = true);
        }, Object.create(null));

        console.log(isMediaData);

        // impression
        // let impression = data.map(item => ({
        //   x: item.owner,
        //   y: item.preview
        // }));

        // Total impression
        // let totalImpression = data.map(item => item.preview);
        // let isTotalImpression = totalImpression.reduce((a, b) => a + b, 0);

        // Group data
        const isKeyFilter = item => moment(item.publishedAt).format("llll");
        // const isKeyFilter = item => item.created_at;
        const isGroupData = _.groupBy(data, isKeyFilter);
        var isGroup = Object.keys(isGroupData).map(key => {
          return { x: moment(key).unix(), y1: isGroupData[key].length };
        });

        this.setState({
          chartTabel: data,
          // tableUser: isUserData,
          totalData: data.length,
          totalUser: isUserData.length,
          totalWord: kata.length,
          totalMedia: isMediaData.length,
          tableMedia: isMediaData,
          tableUser: isUserData,
          chartTimeline: isGroup,
          chartSentiment: sentiment,
          chartWordcloud: kata,
          // impression: impression,
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
            <CardMedia
              totalMedia={this.state.totalMedia}
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
          <Col md={12}>
            <TableMedia
              tableMedia={this.state.tableMedia}
              loading={this.state.loading}
            />
          </Col>
          <Col md={12}>
            <TableUser
              tableUser={this.state.tableUser}
              loading={this.state.loading}
            />
          </Col>
        </Row>
        >
        <TableNews
          chartTabel={this.state.chartTabel}
          loading={this.state.loading}
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
