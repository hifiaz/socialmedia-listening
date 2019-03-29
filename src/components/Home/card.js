import React, { Component } from "react";
import {Link } from "react-router-dom";

import { withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";

import { Skeleton, Card, Icon, Avatar, Col, Row } from "antd";

const { Meta } = Card;

class CardDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      datas: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    let authUser = JSON.parse(localStorage.getItem("authUser"));

    this.props.firebase.project(authUser.uid).on("value", snapshot => {
      const projectObject = snapshot.val();

      const data = Object.keys(projectObject).map(key => ({
        ...projectObject[key],
        key: key
      }));
      this.setState({
        datas: data,
        loading: false
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.project().off();
  }

  render() {
    const { datas, loading } = this.state;
    return (
      <Row gutter={16}>
        <Skeleton loading={loading} avatar active />
        <CardList datas={datas} />
      </Row>
    );
  }
}

const CardList = ({ datas }) => (
  <div>
    {datas.map(data => (
      <Col key={data.key} span={6} style={{ marginBottom: "1rem" }}>
        <Card
          style={{ width: "280" }}
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
          actions={[
            <Icon type="edit" />,
            <Link
              to={{
                pathname: `${ROUTES.DETAILS_PROJECT}/${data.key}`,
                state: { data }
              }}
            >
              <Icon type="arrow-right" />
            </Link>
          ]}
        >
          <Meta
            avatar={
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
            title={data.title}
            description={data.description}
          />
        </Card>
      </Col>
    ))}
  </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(CardDisplay);
