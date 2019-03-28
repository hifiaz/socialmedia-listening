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
    console.log("click ", e);
    this.setState({
      current: e.key
    });
  };
  render() {
    return (
      <Sider width={200} style={{ background: "#fff" }}>
        <Menu
          onClick={this.handleClick}
          defaultOpenKeys={["sub1"]}
          selectedKeys={[this.state.current]}
          mode="inline"
          style={{ height: "100%", borderRight: 0 }}
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
                subnav 2
              </span>
            }
          >
            <Menu.Item key="5">option5</Menu.Item>
            <Menu.Item key="6">option6</Menu.Item>
            <Menu.Item key="7">option7</Menu.Item>
            <Menu.Item key="8">option8</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub3"
            title={
              <span>
                <Icon type="notification" />
                subnav 3
              </span>
            }
          >
            <Menu.Item key="9">option9</Menu.Item>
            <Menu.Item key="10">option10</Menu.Item>
            <Menu.Item key="11">option11</Menu.Item>
            <Menu.Item key="12">option12</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Sidebar);
