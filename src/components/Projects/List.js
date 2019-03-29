import React from "react";
import Layout from "../Layout/index";

import { withAuthorization } from "../Session";
import { Table, Divider, Button } from "antd";
import { Component } from "react";

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description"
  },
  {
    title: "Keywords",
    dataIndex: "keywords",
    key: "keywords"
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <span>
        <Button>Invite</Button>
        <Divider type="vertical" />
        <Button>Delete</Button>
      </span>
    )
  }
];

class ListView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    let authUser = JSON.parse(localStorage.getItem("authUser"));

    this.props.firebase.project(authUser.uid).on("value", snapshot => {
      const projectObject = snapshot.val();

      const data = Object.keys(projectObject).map(key => ({
        ...projectObject[key],
        key: key
      }));
      console.log(data);
      this.setState({
        data: data,
        loading: false
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.project().off();
  }
  render() {
    return (
      <Layout>
        <h1>List</h1>

        <p>All projects will display in here</p>
        <Table columns={columns} dataSource={this.state.data} />
      </Layout>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ListView);
