import React from "react";

import { withAuthorization } from "../../../Session";
import { Table, Card, Skeleton } from "antd";
import numeral from "numeral";

const columns = [
  {
    title: "Channel",
    dataIndex: "channel",
    key: "channel"
  },
  {
    title: "Views",
    dataIndex: "views",
    key: "views",
    render: views => <p>{numeral(views).format("0,0")}</p>
  },
  {
    title: "Link",
    key: "action",
    render: record => (
      <span>
        <a href={record.link} target="_blank" rel="noopener noreferrer">
          Link
        </a>
      </span>
    )
  }
];

function onChange(pagination, filters, sorter) {
  console.log("params", pagination, filters, sorter);
}

const TableYtUser = props => (
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

export default withAuthorization(condition)(TableYtUser);
