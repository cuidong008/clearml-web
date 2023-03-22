import { Group } from "@/types/project"
import { CurrentUser } from "@/types/user"
import { RouteObject } from "@/types/router"

export interface ThemeConfigState {
  primary: string
  isDark: boolean
}

export interface AppStoreState {
  language: string
  sidebarCollapsed: boolean
  sidebarLogo: boolean
  themeConfig: ThemeConfigState
  menuList: Array<RouteObject>
  user?: CurrentUser
}

export interface ProjectConfState {
  showScope: "my" | "public" | "share"
  groups: Group[]
  groupId: string
  orderBy: string
  sortOrder: string
}

export interface StoreState {
  app: AppStoreState
  project: ProjectConfState
}
