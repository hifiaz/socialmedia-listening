import React from "react";
import { Link } from "react-router-dom";

import * as ROUTES from "../../constants/routes";

import { Typography } from "antd";

const { Text } = Typography;

const Landing = () => (
  <div>
    <Text mark className="tengah">
      Semuanya kita mulai dari sini...
      <br />
      Duende
      <br />
      <Link to={ROUTES.SIGN_IN}>Login</Link>
    </Text>
  </div>
);

export default Landing;
