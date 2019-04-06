import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "recompose";

import { withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";

import { Card, Icon, Avatar, List } from "antd";

const { Meta } = Card;

// function CardDisplay() {
//   const [title, description] = useState("");
//   const [datas, setDatas] = useState({});

//   // let authUser = JSON.parse(localStorage.getItem("authUser"));

//   const projects = () => {
//     this.props.firebase.project();
//   };

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
      loading: true
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase.projects().onSnapshot(snapshot => {
      if (snapshot.size) {
        let isProjectList = [];
        snapshot.forEach(doc => {
          isProjectList.push({ ...doc.data(), uid: doc.id });
        });
        this.props.onSetProjects(isProjectList);

        this.setState({
          loading: false
        });
      }
      this.setState({ isProjectList: null, loading: false });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
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
    const { projects } = this.props;
    return (
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4 }}
        dataSource={projects}
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
                  onClick={() => this.onRemoveProject(data.uid)}
                />,
                <Link
                  to={{
                    pathname: `${ROUTES.EDITPROJECT}/${data.uid}`,
                    state: { data }
                  }}
                >
                  <Icon type="edit" />
                </Link>,
                <Link
                  to={{
                    pathname: `${ROUTES.DETAILS_PROJECT}/${data.uid}`,
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

const mapStateToProps = state => ({
  projects: Object.keys(state.projectState.projects || {}).map(key => ({
    ...state.projectState.projects[key]
  }))
});

const mapDispatchToProps = dispatch => ({
  onSetProjects: projects => dispatch({ type: "PROJECTS_SET", projects })
});

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CardDisplay);
