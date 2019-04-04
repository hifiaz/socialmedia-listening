import { combineReducers } from "redux";
import sessionReducer from "./session";
import userReducer from "./user";
import messageReducer from "./message";
import projectReducer from "./project";

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  messageState: messageReducer,
  projectState: projectReducer
});

export default rootReducer;
