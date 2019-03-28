import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import { AuthUserContext } from "../Session";

const { Header } = Layout;

class Navigation extends React.Component {
  render() {
    return (
      <Layout>
        <Header className="header">
          <div className="logo" />
          <AuthUserContext.Consumer>
            {authUser =>
              authUser ? <NavigationAuth /> : <NavigationNonAuth />
            }
          </AuthUserContext.Consumer>
        </Header>
      </Layout>
    );
  }
}

class NavigationAuth extends Component {
  state = {
    current: "home"
  };

  handleClick = e => {
    console.log("click ", e);
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
        <Menu.Item key="home">
          <Link to={ROUTES.HOME}>Home</Link>
        </Menu.Item>
        <Menu.Item key="account">
          <Link to={ROUTES.ACCOUNT}>Account</Link>
        </Menu.Item>
        <Menu.Item key="admin">
          <Link to={ROUTES.ADMIN}>Admin</Link>
        </Menu.Item>
        <SignOutButton />
      </Menu>
      // <ul>
      //   <li>
      //     <Link to={ROUTES.LANDING}>Landing</Link>
      //   </li>
      //   <li>
      //     <Link to={ROUTES.HOME}>Home</Link>
      //   </li>
      //   <li>
      //     <Link to={ROUTES.ACCOUNT}>Account</Link>
      //   </li>
      //   <li>
      //     <Link to={ROUTES.ADMIN}>Admin</Link>
      //   </li>
      //   <li>
      //     <SignOutButton />
      //   </li>
      // </ul>
    );
  }
}

class NavigationNonAuth extends Component {
  state = {
    current: "landing"
  };

  handleClick = e => {
    console.log("click ", e);
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
      // <ul>
      //   <li>
      //     <Link className="btn" to={ROUTES.LANDING}>
      //       Landing
      //     </Link>
      //   </li>
      //   <li>
      //     <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      //   </li>
      // </ul>
    );
  }
}

export default Navigation;
