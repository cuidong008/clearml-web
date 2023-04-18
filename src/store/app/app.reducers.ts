import * as types from "./app.actions-types"
import produce from "immer"
import { AnyAction } from "redux"
import { AppStoreState } from "@/types/store"

const initState: AppStoreState = {
  language: "",
  sidebarCollapsed: false,
  sidebarLogo: true,
  themeConfig: {
    // 默认 primary 主题颜色
    primary: "#1890ff",
    // 深色模式
    isDark: true,
  },
  menuList: [],
  user: undefined,
  users: [],
  preferences: {},
}

export default function app(state = initState, action: AnyAction) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case types.SET_LANGUAGE:
        draftState.language = action.language
        break
      case types.SET_THEME_CONFIG:
        draftState.themeConfig = action.themeConfig
        break
      case types.SET_TOGGLE_SIDEBAR:
        draftState.sidebarCollapsed = !draftState.sidebarCollapsed
        break
      case types.SET_MENU_LIST:
        draftState.menuList = action.menuList
        break
      case types.SET_CURRENT_USER:
        draftState.user = action.user
        break
      case types.SET_USER_LIST:
        draftState.users = action.users
        break
      case types.SET_USER_PREFERENCE:
        draftState.preferences = action.preferences
        break
      default:
        return draftState
    }
  })
}
