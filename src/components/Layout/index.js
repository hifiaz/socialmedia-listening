import React from "react";

import { Layout } from "antd";

import Sidebar from "./sidebar";
import Navigation from "../Navigation";
import algolia from "../Projects/lib/search-algolia.svg"

const { Content, Footer } = Layout;

const DefaultLayout = ({ children }) => (
  <Layout>
    <Sidebar />
    <Layout
      style={{
        minHeight: "100vh"
      }}
    >
      <Navigation />
      <Content style={{ margin: "24px 24px 0" }}>{children}</Content>
      <Footer style={{ textAlign: "center" }}>
        Duende ©2019 Created by Fiaz Luthfi{" "}<br/>
        <img src={algolia} alt="algolia" />
      </Footer>
    </Layout>
  </Layout>
);

export default DefaultLayout;
