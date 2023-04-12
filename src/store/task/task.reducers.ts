import { TaskState } from "@/types/store"
import { AnyAction } from "redux"
import produce from "immer"
import * as types from "./task.actions-types"

export const DEFAULT_COLS: string[] = [
  "type",
  "name",
  "tags",
  "user",
  "started",
  "status",
  "last_update",
  "last_iteration",
  "parent",
]

const initState: TaskState = {
  cols: DEFAULT_COLS,
  selectedTask: undefined,
}

export default function task(state = initState, action: AnyAction) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case types.TASK_SET_COLS:
        draftState.cols = action.cols
        break
      case types.TASK_SET_SELECTED:
        draftState.selectedTask = action.selectedTask
        break
      default:
        return draftState
    }
  })
}
