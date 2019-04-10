import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import { withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";
import {
  Button,
  Card,
  notification,
  Skeleton,
  List,
  Avatar
} from "antd";

import Layout from "../Layout/index";

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
    let authUser = JSON.parse(localStorage.getItem("authUser"));
    let isUser = authUser.uid;
    this.unsubscribe = this.props.firebase
      .projects()
      .where("isUser", "==", isUser)
      .onSnapshot(snapshot => {
        let projects = [];

        snapshot.forEach(doc => projects.push({ ...doc.data(), uid: doc.id }));

        this.setState({
          projects,
          loading: false
        });
      });
  }

  onRemoveProject = event => {
    let id = event.target.id;
    console.log(id);
    this.deleteData = this.props.firebase
      .projects()
      .doc(id)
      .delete()
      .then(() => {
        notification["success"]({
          message: "Project successfully deleted!"
        });
      })
      .catch(err => {
        console.log(err);
      });
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
          <List
            className="demo-loadmore-list"
            // loading={loading}
            itemLayout="horizontal"
            // loadMore={loadMore}
            dataSource={projects}
            renderItem={data => (
              <List.Item
                actions={[
                  <Link
                    to={{
                      pathname: `${ROUTES.EDITPROJECT}/${data.uid}`,
                      state: { data }
                    }}
                  >
                    <Button>Edit</Button>
                  </Link>,
                  <Button id={data.uid} onClick={this.onRemoveProject}>
                    Delete
                  </Button>
                ]}
              >
                <Skeleton
                  avatar
                  title={false}
                  loading={this.state.loading}
                  active
                >
                  <List.Item.Meta
                    avatar={<Avatar>P</Avatar>}
                    title={data.title}
                    description={data.description}
                  />
                  <p>{moment(data.createdAt).format("LLLL")}</p>
                </Skeleton>
              </List.Item>
            )}
          />
          {/* <Skeleton loading={this.state.loading} avatar active>
            <Table dataSource={projects} rowKey={projects => projects.uid}>
              <Column title="Title" dataIndex="title" key="title" />
              <Column
                title="Create"
                render={record => (
                  <p>{moment(record.createdAt).format("LLLL")}</p>
                )}
                key="createdAt"
              />
              <Column
                title="Description"
                dataIndex="description"
                key="description"
              />

              <Column
                title="Action"
                key="key"
                render={data => (
                  <span>
                    <Link
                      to={{
                        pathname: `${ROUTES.EDITPROJECT}/${data.uid}`,
                        state: { data }
                      }}
                    >
                      <Button>Edit</Button>
                    </Link>
                    <Divider type="vertical" />
                    <Button id={data.uid} onClick={this.onRemoveProject}>
                      Delete
                    </Button>
                  </span>
                )}
              />
            </Table>
          </Skeleton> */}
        </Card>
      </Layout>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ListView);
