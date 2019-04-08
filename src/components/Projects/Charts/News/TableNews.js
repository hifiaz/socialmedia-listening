import React from "react";

import { withAuthorization } from "../../../Session";
import { Card, Tag, List } from "antd";

const TableNews = props => (
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
          <b>News</b>
        </div>
      }
      renderItem={item => (
        <List.Item
          key={item.title}
          actions={[
            <Tag>{item.sentiment}</Tag>,
            <Tag>{item.sentiment_score}</Tag>,
            <p>{item.source.name}</p>,
            <p>{item.author}</p>
          ]}
          extra={<img width={272} alt={item.title} src={item.urlToImage} />}
        >
          <List.Item.Meta
            title={
              <a href={item.url} target="_blank" rel="noopener noreferrer">
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

export default withAuthorization(condition)(TableNews);
