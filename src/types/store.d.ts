import { Group, Project } from "@/types/project"
import { CurrentUser, User } from "@/types/user"
import { RouteObject } from "@/types/router"
import { MetricColumn } from "@/types/common"
import { PersistPartial } from "redux-persist/es/persistReducer"

export interface ThemeConfigState {
  primary: string
  isDark: boolean
}

export interface UserPreference {
  rootProjects?: {
    graphVariant: Record<string, MetricColumn>
    tagsColors: Record<string, any>
  }
  version?: number
  firstLogin?: boolean
  users?: {
    activeWorkspace: {
      id: string
      name: string
    }
    showOnlyUserWork: boolean
  }
  views?: {
    autoRefresh: boolean
    neverShowPopupAgain: string[]
    redactedArguments: {
      key: string
    }[]
    hideRedactedArguments: boolean
  }
  projects?: {
    tableModeAwareness: boolean
    orderBy: string
    sortOrder: number
  }
}

export interface AppStoreState {
  language: string
  sidebarCollapsed: boolean
  sidebarLogo: boolean
  themeConfig: ThemeConfigState
  menuList: Array<RouteObject>
  user?: CurrentUser
  users: User[]
  preferences: UserPreference
}

export interface ProjectConfState {
  showScope: "my" | "public" | "share"
  groups: Group[]
  groupId: string
  orderBy: string
  sortOrder: string
  sharedProjects: { id: string }[]
  selectedProject?: Project
}

export interface StoreState {
  app: AppStoreState & PersistPartial
  project: ProjectConfState
}
