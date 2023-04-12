import * as types from "./task.actions-types"

export const setTableColumn = (cols: string[]) => {
  return {
    type: types.TASK_SET_COLS,
    cols,
  }
}
