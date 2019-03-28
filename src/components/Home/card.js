import React from "react";

import { withAuthorization } from "../Session";
import { Card, Icon, Avatar, Col } from "antd";

const { Meta } = Card;

const CardDisplay = () => (
  <Col span={6} style={{marginBottom:"1rem"}}>
    <Card
      style={{ width: 280}}
      cover={
        <img
          alt="example"
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        />
      }
      actions={[
        <Icon type="setting" />,
        <Icon type="edit" />,
        <Icon type="ellipsis" />
      ]}
    >
      <Meta
        avatar={
          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        }
        title="Card title"
        description="This is the description"
      />
    </Card>
  </Col>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(CardDisplay);
