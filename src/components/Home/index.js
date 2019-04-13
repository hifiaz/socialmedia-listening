import React from "react";
import { compose } from "recompose";

import { withAuthorization, withEmailVerification } from "../Session";
import { Typography } from "antd";
import Layout from "../Layout/index";
import CardDisplay from "./card";

const { Title } = Typography;

const HomePage = () => (
  <Layout>
    <Title level={2}>Home</Title>
    <p>All projects will display in here</p>
    <CardDisplay />
  </Layout>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
