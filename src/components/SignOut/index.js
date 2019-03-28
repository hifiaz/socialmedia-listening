import React from "react";
import { Button } from "antd";

import { withFirebase } from "../Firebase";

const SignOutButton = ({ firebase }) => (
  <Button type="button" onClick={firebase.doSignOut} style={{marginLeft:"2em"}}>
    Sign Out
  </Button>
);

export default withFirebase(SignOutButton);
