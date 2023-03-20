import * as types from "@/store/project/project.actions-types";
import { projectGroupsGetAll } from "@/api/project";
import { Group } from "@/types/project";

export const setProjectScope = (scope: string) => {
  return {
    type: types.PROJECT_CHANGE_SCOPE,
    scope,
  };
};

export const changeScope = (scope: string) => (dispatch: any) => {
  return new Promise((resolve) => {
    dispatch(setProjectScope(scope));
    resolve(scope);
  }).then((scope) => {
    if (scope === "public") {
      dispatch(getProjectGroups());
    }
  });
};
export const setProjectOrder = (orderBy: string) => {
  return {
    type: types.PROJECT_CHANGE_ORDER,
    orderBy,
  };
};

export const setProjectSort = (sort: string) => {
  return {
    type: types.PROJECT_CHANGE_SORT,
    sort,
  };
};

export const setProjectGroups = (groups: Group[]) => {
  return {
    type: types.PROJECT_SET_GROUPS,
    groups,
  };
};

export const resetProjectGroup = () => {
  return {
    type: types.PROJECT_RESET_GROUP,
  };
};

export const setProjectGroup = (groupId: string) => {
  return {
    type: types.PROJECT_SET_GROUP,
    groupId,
  };
};

export const getProjectGroups = () => (dispatch: any) => {
  dispatch(resetProjectGroup());
  return new Promise((resolve, reject) => {
    projectGroupsGetAll()
      .then(({ data }) => {
        dispatch(setProjectGroups(data.group_list));
        if (data.group_list.length) {
          dispatch(setProjectGroup(data.group_list[0].id));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
