import React from "react";

import { withAuthorization } from "../../../Session";
import { Card, Tag, List, Icon } from "antd";

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

const TableYt = props => (
  <Card>
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: page => {
          console.log(page);
        },
        pageSize: 3
      }}
      dataSource={props.chartTabel}
      footer={
        <div>
          <b>Youtube</b>
        </div>
      }
      renderItem={item => (
        <List.Item
          key={item.channel}
          actions={[
            <Tag>{item.sentiment}</Tag>,
            <Tag>{item.sentiment_score}</Tag>,
            <IconText type="calendar" text={item.upload_date} />,
            <IconText type="clock-circle" text={item.duration} />,
            <IconText type="eye" text={item.views} />
          ]}
          extra={<img width={272} alt={item.title} src={item.thumbnail} />}
        >
          <List.Item.Meta
            title={
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            }
            description={item.description}
          />
          {item.content}
        </List.Item>
      )}
    />
  </Card>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(TableYt);
