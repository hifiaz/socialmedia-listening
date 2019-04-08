import React from "react";

import { withAuthorization } from "../../../Session";
import { Table, Card, Skeleton } from "antd";

const columns = [
  {
    title: "Media",
    dataIndex: "source.name",
    key: "source.name"
  }
];

function onChange(pagination, filters, sorter) {
  console.log("params", pagination, filters, sorter);
}

const TableNMedia = props => (
  <Card>
    <Skeleton loading={props.loading} avatar active>
      <Table
        rowKey={record => record.id}
        columns={columns}
        dataSource={props.tableMedia}
        onChange={onChange}
      />
    </Skeleton>
  </Card>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(TableNMedia);
