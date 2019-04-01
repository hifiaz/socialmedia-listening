import React from "react";

import { withAuthorization } from "../../Session";
import { Table, Card, Avatar } from "antd";

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
    title: "Convo",
    dataIndex: "text",
    key: "text"
  },
  {
    title: "Sentiment",
    dataIndex: "sentiment",
    key: "sentiment"
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
    <Table
      columns={columns}
      dataSource={props.chartTabel}
      onChange={onChange}
    />
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
