export interface ThemeConfigState {
  primary: string;
  isDark: boolean;
}

export interface SettingState {
  language: string;
  sidebarCollapsed: boolean;
  sidebarLogo: boolean;
  themeConfig: ThemeConfigState;
  menuList: Array<any>;
}
