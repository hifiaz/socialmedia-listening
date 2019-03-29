import React from "react";

import { Layout } from "antd";

import Sidebar from "./sidebar";
import Navigation from "../Navigation";

const { Content } = Layout;

const DefaultLayout = ({ children }) => (
  <Layout>
    <Sidebar />
    <Layout>
      <Navigation />
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280
        }}
      >
        {children}
      </Content>
    </Layout>
  </Layout>
);

export default DefaultLayout;
