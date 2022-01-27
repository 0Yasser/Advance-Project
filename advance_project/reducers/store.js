import { combineReducers, createStore } from "redux";
import token from "./token";
import user from "./user";

const reducers = combineReducers({token,user})
const store = createStore(reducers)
export default store;