import * as types from "./app.actions-types"
import { ThemeConfigState } from "@/types/store"
import { RouteObject } from "@/types/router"
import { ThunkActionDispatch } from "redux-thunk"
import { CurrentUser, User } from "@/types/user"
import { getCurrentUser, getUserAll } from "@/api/user"
import { message } from "antd"

export const setLanguage = (language: string) => {
  return {
    type: types.SET_LANGUAGE,
    language,
  }
}

// * setThemeConfig
export const setThemeConfig = (themeConfig: ThemeConfigState) => {
  return {
    type: types.SET_THEME_CONFIG,
    themeConfig,
  }
}

export const toggleSideBar = () => {
  return {
    type: types.SET_TOGGLE_SIDEBAR,
  }
}

export const setMenuList = (menuList: Array<RouteObject>) => ({
  type: types.SET_MENU_LIST,
  menuList,
})

export const setUser = (user?: CurrentUser) => {
  return {
    type: types.SET_CURRENT_USER,
    user,
  }
}

export const setAllUser = (users: User[]) => {
  return {
    type: types.SET_USER_LIST,
    users,
  }
}

export const getLoginUser =
  () =>
  (dispatch: ThunkActionDispatch<any>): Promise<CurrentUser | undefined> => {
    return new Promise((resolve, reject) => {
      getCurrentUser()
        .then(({ data }) => {
          dispatch(setUser(data.user))
          resolve(data.user)
        })
        .catch((err) => {
          localStorage.removeItem("authTk")
          message.error("获取用户失败，请重新登录！")
          window.location.href = "/login"
          reject(err)
        })
    })
  }

export const getAllUser =
  () =>
  (dispatch: ThunkActionDispatch<any>): Promise<User[] | undefined> => {
    return new Promise((resolve, reject) => {
      getUserAll({
        only_fields: ["id", "name"],
        page_size: 10000,
        page: 0,
      }).then(({ data, meta }) => {
        if (meta.result_code !== 200) {
          message.error(meta.result_msg)
          reject()
        }
        dispatch(setAllUser(data.users ?? []))
        resolve(data.users)
      })
    })
  }
