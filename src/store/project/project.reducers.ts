import { AnyAction } from "redux"
import produce from "immer"
import { ProjectConfState } from "@/types/store"
import * as types from "./project.actions-types"

const initState: ProjectConfState = {
  showScope: "my",
  orderBy: "last_update",
  sortOrder: "desc",
  groups: [],
  groupId: "",
  sharedProjects: [],
}

export default function project(state = initState, action: AnyAction) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case types.PROJECT_CHANGE_SORT:
        draftState.sortOrder = action.sort
        break
      case types.PROJECT_CHANGE_SCOPE:
        draftState.showScope = action.scope
        if (action.scope === "my") {
          draftState.groups = []
          draftState.groupId = ""
          draftState.sharedProjects = []
        }
        break
      case types.PROJECT_CHANGE_ORDER:
        draftState.orderBy = action.orderBy
        break
      case types.PROJECT_RESET_GROUP:
        draftState.groups = []
        draftState.groupId = ""
        break
      case types.PROJECT_SET_GROUPS:
        draftState.groups = action.groups
        break
      case types.PROJECT_SET_GROUP:
        draftState.groupId = action.groupId
        break
      case types.PROJECT_RESET_SHARED:
        draftState.sharedProjects = []
        break
      case types.PROJECT_SET_SHARED:
        draftState.sharedProjects = action.shared
        break
      default:
        return draftState
    }
  })
}
