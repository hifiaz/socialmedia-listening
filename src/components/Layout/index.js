import React from "react";
import { Layout } from "antd";
import Sidebar from './sidebar'

const { Content } = Layout;

const DefaultLayout = ({children}) => (
  <Layout>
    <Layout>
      <Sidebar/>
      <Layout style={{ padding: "24px 24px 24px" }}>
        <Content
          style={{
            background: "#fff",
            padding: 24,
            margin: 0,
            minHeight: 280
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  </Layout>
);

export default DefaultLayout;
