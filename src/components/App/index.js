import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {Helmet} from "react-helmet";

// import Layout from "../Layout/index";
// import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";
// Projects
import ListView from "../Projects/List";
import AddView from "../Projects/Add";
import EditView from "../Projects/Edit";
import DetailsView from "../Projects/Details";

//News
import NewsPage from "../News/index";

//Twitter
import TwitterPage from "../Twitter/index";

//Instagram
import InstagramPage from "../Instagram/index";

//Youtube
import YoutubePage from "../Youtube/index";

import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../Session";
import LayoutDefault from "../Layout/index";

const App = () => (
  <Router>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Monitoring Duende</title>
      <link rel="canonical" href="http://monitoring.devduende.com/" />
    </Helmet>
    {/* <Navigation /> */}

    <Route exact path={ROUTES.LANDING} component={LandingPage} />
    <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
    <Route path={ROUTES.SIGN_IN} component={SignInPage} />
    <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
    <Route path={ROUTES.HOME} component={HomePage} layout={LayoutDefault} />
    <Route path={ROUTES.ACCOUNT} component={AccountPage} />
    <Route path={ROUTES.ADMIN} component={AdminPage} />
    <Route path={ROUTES.LIST} component={ListView} />
    <Route path={ROUTES.ADDPROJECT} component={AddView} />
    <Route path={ROUTES.EDITPROJECT} component={EditView} />
    <Route path={ROUTES.DETAILS_PROJECT} component={DetailsView} />
    <Route path={ROUTES.NEWS} component={NewsPage} layout={LayoutDefault} />
    <Route path={ROUTES.TWITTER} component={TwitterPage} layout={LayoutDefault} />
    <Route path={ROUTES.INSTAGRAM} component={InstagramPage} layout={LayoutDefault} />
    <Route path={ROUTES.YOUTUBE} component={YoutubePage} layout={LayoutDefault} />
  </Router>
);

export default withAuthentication(App);
