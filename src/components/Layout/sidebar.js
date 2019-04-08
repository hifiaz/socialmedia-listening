import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Layout, Menu, Icon } from "antd";

import { withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

const { SubMenu } = Menu;
const { Sider } = Layout;

const Sidebar = ({ authUser }) =>
  authUser ? (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={broken => {
        console.log(broken);
      }}
    >
      <div className="logo" />
      <Menu
        defaultOpenKeys={["sub1", "sub2", "sub3"]}
        mode="inline"
        theme="dark"
        style={{ borderRight: 0 }}
      >
        <Menu.Item key="home1">
          <Link to={ROUTES.HOME}>
            <Icon type="home" />
            Home
          </Link>
        </Menu.Item>
        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="user" />
              Projects
            </span>
          }
        >
          <Menu.Item key="sub12">
            <Link to={ROUTES.LIST}>List</Link>
          </Menu.Item>
          <Menu.Item key="sub13">
            <Link to={ROUTES.ADDPROJECT}>Add</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub2"
          title={
            <span>
              <Icon type="laptop" />
              Social Media
            </span>
          }
        >
          <Menu.Item key="5">
            <Link to={ROUTES.TWITTER}>Twitter</Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to={ROUTES.INSTAGRAM}>Instagram</Link>
          </Menu.Item>
          <Menu.Item key="7">
            <Link to={ROUTES.YOUTUBE}>Youtube</Link>
          </Menu.Item>
          <Menu.Item key="8">
            <Link to={ROUTES.NEWS}>News</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="account">
          <Link to={ROUTES.ACCOUNT}>
            <Icon type="user" />
            Account
          </Link>
        </Menu.Item>
        {authUser.roles.includes(ROLES.ADMIN) && (
          <Menu.Item key="admin">
            <Link to={ROUTES.ADMIN}>
              <Icon type="skin" />
              Admin
            </Link>
          </Menu.Item>
        )}
      </Menu>
    </Sider>
  ) : (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={broken => {
        console.log(broken);
      }}
    >
      <div className="logo" />
    </Sider>
  );

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

const condition = authUser => !!authUser;

export default compose(
  connect(mapStateToProps),
  withAuthorization(condition)
)(Sidebar);
