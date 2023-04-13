import * as types from "./task.actions-types"
import { Task } from "@/types/task"

export const setTableColumn = (cols: string[]) => {
  return {
    type: types.TASK_SET_COLS,
    cols,
  }
}

export const setSelectedTask = (selectedTask?: Task) => {
  console.log("set t")
  return {
    type: types.TASK_SET_SELECTED,
    selectedTask,
  }
}
