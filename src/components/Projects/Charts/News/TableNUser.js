import React from "react";

import { withAuthorization } from "../../../Session";
import { Table, Skeleton, Card } from "antd";

const columns = [
  {
    title: "Writer",
    dataIndex: "author",
    key: "author"
  }
];

function onChange(pagination, filters, sorter) {
  console.log("params", pagination, filters, sorter);
}

const TableNUser = props => (
  <Card>
    <Skeleton loading={props.loading} avatar active>
      <Table
        rowKey={record => record.objectID}
        columns={columns}
        dataSource={props.tableUser}
        onChange={onChange}
      />
    </Skeleton>
  </Card>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(TableNUser);
