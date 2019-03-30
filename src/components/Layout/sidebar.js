import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Icon } from "antd";

import * as ROUTES from "../../constants/routes";
import { withAuthorization } from "../Session";
import { Component } from "react";

const { SubMenu } = Menu;
const { Sider } = Layout;

class Sidebar extends Component {
  state = {
    current: "home1"
  };

  handleClick = e => {
    // console.log("click ", e);
    this.setState({
      current: e.key
    });
  };
  render() {
    return (
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" />
        <Menu
          onClick={this.handleClick}
          defaultOpenKeys={["sub1", "sub2", "sub3"]}
          selectedKeys={[this.state.current]}
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
            <Menu.Item key="5">Twitter</Menu.Item>
            <Menu.Item key="6">Instagram</Menu.Item>
            <Menu.Item key="7">Facebook</Menu.Item>
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
          <Menu.Item key="admin">
            <Link to={ROUTES.ADMIN}>
              <Icon type="skin" />
              Admin
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Sidebar);