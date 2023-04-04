import * as types from "./experiment.actions-types"

export const setTableColumn = (cols: string[]) => {
  return {
    type: types.EXPERIMENT_SET_COLS,
    cols,
  }
}
