import { Group } from "@/types/project";

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

export interface ProjectConfState {
  showScope: "my" | "public" | "share";
  groups: Group[];
  groupId: string;
  orderBy: string;
  sortOrder: string;
}

export interface StoreState {
  app: SettingState;
  project: ProjectConfState;
}
