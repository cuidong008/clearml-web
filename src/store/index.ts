import app from "@/store/app/app.reducers"
import project from "@/store/project/project.reducers"
import {
  applyMiddleware,
  combineReducers,
  compose,
  legacy_createStore as createStore,
} from "redux"

import reduxPromise from "redux-promise"
import reduxThunk from "redux-thunk"
import reduxLogger from "redux-logger"
import { StoreState } from "@/types/store"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import experiment from "@/store/experiment/experiment.reducers"
import { ThunkDispatcher } from "@/types/common"

const persistConfig = {
  key: "redux-state",
  storage: storage,
}
// 开启 redux-devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// redux 持久化配置
const persistApp = persistReducer(persistConfig, app)
const reducer = combineReducers<StoreState>({
  app: persistApp,
  experiment,
  project,
})
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(reduxThunk, reduxPromise, reduxLogger)),
)
export const useStoreSelector: TypedUseSelectorHook<StoreState> = useSelector
export const useThunkDispatch = useDispatch<ThunkDispatcher>

persistStore(store)
export default store
