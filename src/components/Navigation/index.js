import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Icon } from "antd";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
// import * as ROLES from "../../constants/roles";
import { AuthUserContext } from "../Session";

const { Header } = Layout;

class Navigation extends React.Component {
  render() {
    return (
      <Header style={{ background: "#fff", padding: 0 }}>
        <AuthUserContext.Consumer>
          {authUser =>
            authUser ? (
              <NavigationAuth authUser={authUser} />
            ) : (
              <NavigationNonAuth />
            )
          }
        </AuthUserContext.Consumer>
      </Header>
    );
  }
}

class NavigationAuth extends Component {
  state = {
    current: "home"
  };

  handleClick = e => {
    // console.log("click ", e);
    this.setState({
      current: e.key
    });
  };
  render() {
    return (
      <Menu
        mode="horizontal"
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        style={{ lineHeight: "64px", float: "right", paddingRight: "1rem" }}
      >
        <Menu.Item key="home">
          <Link to={ROUTES.HOME}>Home</Link>
        </Menu.Item>
        <Menu.Item key="account">
          <Link to={ROUTES.ACCOUNT}>Account</Link>
        </Menu.Item>
        {/* {authUser.roles.includes(ROLES.ADMIN) && ( */}
        <Menu.Item key="admin">
          <Link to={ROUTES.ADMIN}>Admin</Link>
        </Menu.Item>
        {/* )} */}
        <SignOutButton />
      </Menu>
    );
  }
}

class NavigationNonAuth extends Component {
  state = {
    current: "landing"
  };

  handleClick = e => {
    // console.log("click ", e);
    this.setState({
      current: e.key
    });
  };
  render() {
    return (
      <Menu
        theme="dark"
        mode="horizontal"
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        style={{ lineHeight: "64px" }}
      >
        <Menu.Item key="landing">
          <Link to={ROUTES.LANDING}>Landing</Link>
        </Menu.Item>
        <Menu.Item key="signin">
          <Link to={ROUTES.SIGN_IN}>Login</Link>
        </Menu.Item>
      </Menu>
    );
  }
}

export default Navigation;
