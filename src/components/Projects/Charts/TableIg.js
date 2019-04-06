import React from "react";

import { withAuthorization } from "../../Session";
import { Table, Card, Icon, Skeleton, Tag } from "antd";
import moment from "moment";

const { Meta } = Card;
const columns = [
  {
    title: "Owner",
    key: "owner",
    render: record => (
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<img alt={record.accessibility_caption} src={record.display} />}
        actions={[
          <p>
            <Icon type="like" /> {record.like}{" "}
          </p>,
          <p>
            <Icon type="message" /> {record.comment}
          </p>
        ]}
      >
        <Meta description={moment(record.created_at).format("LLLL")} />
      </Card>
    )
  },
  // {
  //   title: "Date",
  //   key: "id",
  //   dataIndex: "id",
  // },
  {
    title: "Caption",
    dataIndex: "caption",
    width:280,
    key: "caption"
  },
  {
    title: "Sentiment",
    key: "sentiment",
    render: record => {
      let color = null;
      let sentimens = record.sentiment;
      if (sentimens === "negative") {
        color = "volcano";
      } else if (sentimens === "positive") {
        color = "green";
      } else {
        color = "geekblue";
      }
      return (
        <span>
          <Tag color={color}>{record.sentiment}</Tag>
          <Tag>{record.sentiment_score}</Tag>
        </span>
      );
    }
  },
  {
    title: "Link",
    key: "action",
    render: record => (
      <span>
        <a
          href={"https://www.instagram.com/p/" + record.shortcode}
          target="_blank"
          rel="noopener noreferrer"
        >
          See Details
        </a>
      </span>
    )
  }
];

function onChange(pagination, filters, sorter) {
  console.log("params", pagination, filters, sorter);
}

const TableIg = props => (
  <Card>
    <Skeleton loading={props.loading} avatar active>
      <Table
        rowKey={record => record.id}
        columns={columns}
        dataSource={props.chartTabel}
        onChange={onChange}
      />
    </Skeleton>
  </Card>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(TableIg);
