import React from "react";

import { withAuthorization } from "../../../Session";
import { Table, Card, Avatar, Skeleton } from "antd";

const columns = [
  {
    title: "Profile",
    dataIndex: "user.profile_image_url",
    key: "user.profile_image_url",
    render: id => <Avatar src={id} />
  },
  {
    title: "Authors",
    dataIndex: "user.name",
    key: "user.name"
  },
  {
    title: "Following",
    dataIndex: "user.friends_count",
    key: "user.friends_count"
  },
  {
    title: "Followers",
    dataIndex: "user.followers_count",
    key: "user.followers_count"
  },
  {
    title: "Link",
    key: "action",
    render: (text, record) => (
      <span>
        <a
          href={
            "https://twitter.com/" + record.user.id + "/statuses/" + record.id
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          Link
        </a>
      </span>
    )
  }
];

function onChange(pagination, filters, sorter) {
  console.log("params", pagination, filters, sorter);
}

const TableUser = props => (
  <Card>
    <Skeleton loading={props.loading} avatar active>
      <Table
        rowKey={record => record.id}
        columns={columns}
        dataSource={props.tableUser}
        onChange={onChange}
      />
    </Skeleton>
  </Card>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(TableUser);
