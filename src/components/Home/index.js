import React from "react";
import Layout from "../Layout/index";
import CardDisplay from "./card";

import { withAuthorization } from "../Session";
import { Row } from "antd";

const HomePage = () => (
  <Layout>
    <h1>Home</h1>
    <p>All projects will display in here</p>
    <Row>
      <CardDisplay />
      <CardDisplay />
      <CardDisplay />
      <CardDisplay />
      <CardDisplay />
      <CardDisplay />
      <CardDisplay />
      <CardDisplay />
      <CardDisplay />
      <CardDisplay />
      <CardDisplay />
      <CardDisplay />
    </Row>
  </Layout>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
