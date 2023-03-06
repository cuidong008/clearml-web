import app from "@/store/app/app.reducers";
import {
  applyMiddleware,
  combineReducers,
  compose,
  legacy_createStore as createStore,
} from "redux";

import reduxPromise from "redux-promise";
import reduxThunk from "redux-thunk";
import reduxLogger from "redux-logger";

// 开启 redux-devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// redux 持久化配置

const reducer = combineReducers({
  app,
});
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(reduxThunk, reduxPromise, reduxLogger))
);

export default store;
