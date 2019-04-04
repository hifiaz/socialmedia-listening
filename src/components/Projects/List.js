import React, { Component } from "react";
import { Link } from "react-router-dom";

import { withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";
import { Table, Divider, Button, Card } from "antd";

import Layout from "../Layout/index";

const { Column } = Table;

class ListView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      projects: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    // this.unsubscribe = this.props.firebase.projects().onSnapshot(snapshot => {
    //   let projects = [];

    //   snapshot.forEach(doc => projects.push({ ...doc.data(), uid: doc.id }));

    //   this.setState({
    //     projects,
    //     loading: false
    //   });
    // });
  }

  onRemoveProject = event => {
    let id = event.target.id;
    let authUser = JSON.parse(localStorage.getItem("authUser"));
    console.log(id);
    this.props.firebase
      .project(authUser.uid)
      .child(id)
      .remove();
  };

  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    const { projects } = this.state;
    return (
      <Layout>
        <h1>List</h1>

        <p>All projects will display in here</p>
        <Card bordered={false}>
          <Table dataSource={projects}>
            <Column title="Title" dataIndex="title" key="title" />
            <Column
              title="Description"
              dataIndex="description"
              key="description"
            />
            <Column title="Keywords" dataIndex="keywords" key="keywords" />
            <Column
              title="Action"
              key="key"
              render={data => (
                <span>
                  <Link
                    to={{
                      pathname: `${ROUTES.EDITPROJECT}/${data.key}`,
                      state: { data }
                    }}
                  >
                    <Button>Edit</Button>
                  </Link>
                  <Divider type="vertical" />
                  <Button id={data.key} onClick={this.onRemoveProject}>
                    Delete
                  </Button>
                </span>
              )}
            />
          </Table>
        </Card>
      </Layout>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ListView);
