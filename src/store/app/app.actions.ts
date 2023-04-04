import * as types from "./app.actions-types"
import { AppStoreState, ThemeConfigState, UserPreference } from "@/types/store"
import { RouteObject } from "@/types/router"
import { CurrentUser, User } from "@/types/user"
import {
  getCurrentUser,
  getUserAll,
  getUserPreferences,
  setUserPreferences,
} from "@/api/user"
import { message } from "antd"
import { PersistPartial } from "redux-persist/es/persistReducer"
import { TagColor, ThunkDispatcher } from "@/types/common"
import { cloneDeep } from "lodash"
import { tagColorManager } from "@/components/TagList/tagColors"

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

export const setUserPreferencesAll = (preferences: UserPreference) => {
  return {
    type: types.SET_USER_PREFERENCE,
    preferences,
  }
}

export const setTagColors =
  (colors: { [p: string]: TagColor }) =>
  (dispatch: ThunkDispatcher, getState: () => AppStoreState) => {
    const { preferences } = getState()
    if (preferences.rootProjects) {
      const temp = cloneDeep(preferences.rootProjects)
      temp.tagsColors = { ...preferences.rootProjects?.tagsColors, ...colors }
      dispatch(uploadUserPreference("rootProjects", temp))
    }
  }

export const uploadUserPreference =
  (field: keyof UserPreference, newValue: object) =>
  (dispatch: ThunkDispatcher, getState: () => AppStoreState) => {
    return new Promise((resolve, reject) => {
      setUserPreferences({
        preferences: { [field]: newValue },
      })
        .then(({ data, meta }) => {
          if (meta.result_code !== 200) {
            message.error(meta.result_msg)
            reject(new Error(meta.result_msg))
            return
          }
          const { preferences } = getState()
          dispatch(setUserPreferencesAll({ ...preferences, [field]: newValue }))
          resolve({})
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

export const getLoginUser =
  () =>
  (dispatch: ThunkDispatcher): Promise<CurrentUser | undefined> => {
    return new Promise((resolve, reject) => {
      Promise.all([getCurrentUser(), getUserPreferences()])
        .then(([userResp, refResp]) => {
          dispatch(setUser(userResp.data.user))
          dispatch(setUserPreferencesAll(refResp.data.preferences ?? {}))
          if (refResp.data.preferences?.rootProjects?.tagsColors) {
            tagColorManager.tagsColorMap =
              refResp.data.preferences.rootProjects.tagsColors
          }

          resolve(userResp.data.user)
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
  (dispatch: ThunkDispatcher): Promise<User[] | undefined> => {
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
