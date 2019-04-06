import React from "react";

import { withAuthorization } from "../../Session";
import { Table, Card, Avatar, Skeleton, Tag } from "antd";
import moment from "moment";

const columns = [
  {
    title: "User",
    dataIndex: "user.profile_image_url",
    key: "user.profile_image_url",
    render: id => <Avatar src={id} />
  },
  {
    title: "Username",
    dataIndex: "user.name",
    key: "user.name"
  },
  {
    title: "Date",
    // dataIndex: moment.unix("created_at").format("YYYY-MM-DD"),
    key: "created_at",
    render: (text, record) => <p>{moment(record.created_at).format("LLLL")}</p>
  },
  {
    title: "Convo",
    dataIndex: "text",
    width: 280,
    key: "text"
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
    render: (text, record) => (
      <span>
        <a
          href={
            "https://twitter.com/" +
            record.user.screen_name +
            "/statuses/" +
            record.id
          }
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

const TableView = props => (
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

// class TableView extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       loading: false,
//       chartTabel: [],
//       ...props.location.state
//     };
//   }
//   render() {
//     return (
//       <Card>
//         <Table
//           columns={columns}
//           dataSource={this.props.chartTabel}
//           onChange={onChange}
//         />
//       </Card>
//     );
//   }
// }

const condition = authUser => !!authUser;

export default withAuthorization(condition)(TableView);
