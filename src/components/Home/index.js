import React from "react";
import { compose } from "recompose";

import { withAuthorization, withEmailVerification } from "../Session";
import Layout from "../Layout/index";
import CardDisplay from "./card";

const HomePage = () => (
  <Layout>
    <h1>Home</h1>
    <p>All projects will display in here</p>
    <CardDisplay />
  </Layout>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
