import { ExperimentState } from "@/types/store"
import { AnyAction } from "redux"
import produce from "immer"
import * as types from "./experiment.actions-types"

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

const initState: ExperimentState = {
  cols: DEFAULT_COLS,
}

export default function experiment(state = initState, action: AnyAction) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case types.EXPERIMENT_SET_COLS:
        draftState.cols = action.cols
        break
      default:
        return draftState
    }
  })
}
