import * as types from "@/store/project/project.actions-types"
import { projectGroupsGetAll, projectsShareGetAll } from "@/api/project"
import { Group, Project } from "@/types/project"
import { ThunkActionDispatch } from "redux-thunk"

export const setProjectScope = (scope: string) => {
  return {
    type: types.PROJECT_CHANGE_SCOPE,
    scope,
  }
}

export const changeScope =
  (scope: string) => (dispatch: ThunkActionDispatch<any>) => {
    return new Promise((resolve) => {
      dispatch(setProjectScope(scope))
      resolve(scope)
    }).then((scope) => {
      if (scope === "public") {
        dispatch(getProjectGroups())
      }
      if (scope === "share") {
        dispatch(getProjectShare())
      }
    })
  }
export const setProjectOrder = (orderBy: string) => {
  return {
    type: types.PROJECT_CHANGE_ORDER,
    orderBy,
  }
}

export const setProjectSort = (sort: string) => {
  return {
    type: types.PROJECT_CHANGE_SORT,
    sort,
  }
}

export const setProjectGroups = (groups: Group[]) => {
  return {
    type: types.PROJECT_SET_GROUPS,
    groups,
  }
}

export const resetProjectGroup = () => {
  return {
    type: types.PROJECT_RESET_GROUP,
  }
}

export const resetProjectShared = () => {
  return {
    type: types.PROJECT_RESET_SHARED,
  }
}

export const setProjectShared = (shared: { id: string }[]) => {
  return {
    type: types.PROJECT_SET_SHARED,
    shared,
  }
}

export const setProjectGroup = (groupId: string) => {
  return {
    type: types.PROJECT_SET_GROUP,
    groupId,
  }
}

export const setProjectSelected = (project?: Project) => {
  return {
    type: types.SET_SELECT_PROJECT,
    project,
  }
}

export const getProjectGroups = () => (dispatch: ThunkActionDispatch<any>) => {
  dispatch(resetProjectGroup())
  return new Promise((resolve, reject) => {
    projectGroupsGetAll()
      .then(({ data }) => {
        dispatch(setProjectGroups(data.group_list))
        if (data.group_list.length) {
          dispatch(setProjectGroup(data.group_list[0].id))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const getProjectShare = () => (dispatch: ThunkActionDispatch<any>) => {
  dispatch(resetProjectShared())
  return new Promise((resolve, reject) => {
    projectsShareGetAll()
      .then(({ data }) => {
        dispatch(setProjectShared(data.project_list))
      })
      .catch((error) => {
        reject(error)
      })
  })
}
