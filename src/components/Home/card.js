import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";

import { Card, Icon, Avatar, List } from "antd";

const { Meta } = Card;

// function CardDisplay() {
//   const [title, description] = useState("");
//   const [datas, setDatas] = useState({});

//   let authUser = JSON.parse(localStorage.getItem("authUser"));

//   const projects = this.props.firebase.project(authUser.uid);

//   useEffect(() => {
//     const handlingProject = snap => {
//       if (snap.val()) setDatas(snap.val());
//     };
//     projects.on("value", handlingProject);
//     return () => {
//       projects.off("value", handlingProject);
//     };
//   });

//   return (
//     <List
//       grid={{ gutter: 16, column: 4 }}
//       dataSource={datas}
//       renderItem={data => (
//         <List.Item>
//           <Card
//             style={{ width: "280" }}
//             cover={
//               <img
//                 alt="example"
//                 src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
//               />
//             }
//             actions={[
//               <Icon
//                 type="delete"
//                 onClick={() => this.onRemoveProject(data.key)}
//               />,
//               <Link
//                 to={{
//                   pathname: `${ROUTES.EDITPROJECT}/${data.key}`,
//                   state: { data }
//                 }}
//               >
//                 <Icon type="edit" />
//               </Link>,
//               <Link
//                 to={{
//                   pathname: `${ROUTES.DETAILS_PROJECT}/${data.key}`,
//                   state: { data }
//                 }}
//               >
//                 <Icon type="arrow-right" />
//               </Link>
//             ]}
//           >
//             <Meta
//               avatar={
//                 <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
//               }
//               title={data.title}
//               description={data.description}
//             />
//           </Card>
//         </List.Item>
//       )}
//     />
//   );
// }

class CardDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      datas: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    let authUser = JSON.parse(localStorage.getItem("authUser"));
    let data;

    this.props.firebase.project(authUser.uid).on("value", snapshot => {
      if (snapshot.exists()) {
        const projectObject = snapshot.val();
        data = Object.keys(projectObject).map(key => ({
          ...projectObject[key],
          key: key
        }));
      }
      this.setState({
        data: data,
        loading: false
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.project().off();
  }

  onRemoveProject = id => {
    let authUser = JSON.parse(localStorage.getItem("authUser"));
    // console.log('ini'+id);
    this.props.firebase
      .project(authUser.uid)
      .child(id)
      .remove();
  };

  render() {
    const { data } = this.state;
    return (
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={data}
        renderItem={data => (
          <List.Item>
            <Card
              style={{ width: "280" }}
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <Icon
                  type="delete"
                  onClick={() => this.onRemoveProject(data.key)}
                />,
                <Link
                  to={{
                    pathname: `${ROUTES.EDITPROJECT}/${data.key}`,
                    state: { data }
                  }}
                >
                  <Icon type="edit" />
                </Link>,
                <Link
                  to={{
                    pathname: `${ROUTES.DETAILS_PROJECT}/${data.key}`,
                    state: { data }
                  }}
                >
                  <Icon type="arrow-right" />
                </Link>
              ]}
            >
              <Meta
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
                title={data.title}
                description={data.description}
              />
            </Card>
          </List.Item>
        )}
      />
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(CardDisplay);
