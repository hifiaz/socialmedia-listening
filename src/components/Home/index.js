import React from "react";
import { compose } from "recompose";

import { withAuthorization, withEmailVerification } from "../Session";
import { Typography } from "antd";
import Layout from "../Layout/index";
import CardDisplay from "./card";

const { Title } = Typography;

// function onFefetchProjects() {
//   this.props.firebase.projects().onSnapshot(snapshot => {
//     if (snapshot.size) {
//       console.log(snapshot);
//       return snapshot;
//     }
//     return null;
//   });
// }

// function HomePage() {
//   const [data, setData] = useState(null);

//   // async function fetchMyAPI() {
//   //   let response = await fetch("https://jsonplaceholder.typicode.com/posts");
//   //   const data = await response.json();
//   //   const [item] = data;
//   //   setData(item);
//   // }

//   useEffect(() => {
//     onFefetchProjects();
//     // fetchMyAPI();
//     // const response = await fetch("");
//     // const data = await response.json();
//     // const [item] = data;
//     // setData(item);
//   }, []);
//   return (
//     <Layout>
//       <Title level={2}>Home</Title>
//       <p>All projects will display in here</p>
//       {/* <CardDisplay /> */}
//       {data && <p>{data.title}</p>}
//     </Layout>
//   );
// }
const HomePage = () => (
  <Layout>
    <Title level={2}>Home</Title>
    <p>All projects will display in here</p>
    <CardDisplay />
  </Layout>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
