import * as types from "./app.actions-types";
import { ThemeConfigState } from "@/types/store";

export const setLanguage = (language: string) => {
  return {
    type: types.SET_LANGUAGE,
    language,
  };
};

// * setThemeConfig
export const setThemeConfig = (themeConfig: ThemeConfigState) => {
  return {
    type: types.SET_THEME_CONFIG,
    themeConfig,
  };
};

export const toggleSideBar = () => {
  return {
    type: types.SET_TOGGLE_SIDEBAR,
  };
};

export const setMenuList = (menuList: Array<any>) => ({
  type: types.SET_MENU_LIST,
  menuList,
});
