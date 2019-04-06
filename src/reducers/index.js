import { combineReducers } from "redux";
import sessionReducer from "./session";
import userReducer from "./user";
import messageReducer from "./message";
import projectReducer from "./project";
import twitterReducer from "./twitter";
import instagramReducer from "./instagram";
import newsReducer from "./news";

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  messageState: messageReducer,
  projectState: projectReducer,
  twitterState: twitterReducer,
  instagramState: instagramReducer,
  newsState: newsReducer
});

export default rootReducer;
