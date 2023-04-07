import { Task } from "@/types/task"
import { TaskStatusEnum, TaskTypeEnum } from "@/types/enums"
import { get } from "lodash"

export const TASK_TYPES = {
  TRAINING: "training",
  ANNOTATION: "annotation",
  MANUAL_ANNOTATION: "annotation_manual",
  TESTING: "testing",
}
export const selectionAllIsArchive = (selectedElements: Task[]) =>
  selectedElements.every((s) => s?.system_tags?.includes("archived"))
export const selectionIsArchive = (selectedElements: Task) =>
  selectedElements?.system_tags?.includes("archived")
export const canEnqueue = (task: Task): boolean =>
  task &&
  (TaskStatusEnum.Created === task.status ||
    TaskStatusEnum.Stopped === task.status) &&
  task.type !== TASK_TYPES.MANUAL_ANNOTATION

export const canDequeue = (task: Task): boolean =>
  task && TaskStatusEnum.Queued === task.status

export const canContinue = (task: Task): boolean =>
  task &&
  [TaskStatusEnum.Created, TaskStatusEnum.Stopped].includes(
    task.status ?? "unknown",
  ) &&
  task.type !== TASK_TYPES.MANUAL_ANNOTATION &&
  !!task.execution?.queue
export const countAvailableAndIsDisable = (selectedFiltered: Task[]) => ({
  available: selectedFiltered.length,
  disable: selectedFiltered.length === 0,
})
export const isReadOnly = (item: Task) => {
  if (get(item, "id") === "*") {
    return false
  }
  return !get(item, "company.id") || !!get(item, "readOnly")
}
export const selectionDisabledAbort = (selectedElements: Task[]) => {
  const selectedFiltered = selectedElements.filter(
    (_selected) =>
      [TaskStatusEnum.Queued, TaskStatusEnum.InProgress].includes(
        _selected?.status ?? "unknown",
      ) && !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}
export const selectionDisabledPublishExperiments = (
  selectedElements: Task[],
) => {
  const selectedFiltered = selectedElements.filter(
    (_selected) =>
      [
        TaskStatusEnum.Stopped,
        TaskStatusEnum.Closed,
        "completed",
        TaskStatusEnum.Failed,
      ].includes(_selected?.status ?? "unknown") && !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}
export const selectionDisabledPublishModels = (selectedElements: Task[]) => {
  const selectedFiltered = selectedElements.filter(
    (_selected) => !isReadOnly(_selected) && !_selected?.ready,
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}

export const selectionDisabledReset = (selectedElements: Task[]) => {
  const selectedFiltered = selectedElements.filter(
    (_selected) =>
      ![
        TaskStatusEnum.Created,
        TaskStatusEnum.Published,
        TaskStatusEnum.Publishing,
      ].includes(_selected?.status ?? "unknown") && !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}

export const selectionDisabledAbortAllChildren = (selectedElements: Task[]) => {
  const selectedFiltered = selectedElements.filter(
    (_selected) =>
      [TaskTypeEnum.Controller, TaskTypeEnum.Optimizer].includes(
        _selected?.type ?? "unknown",
      ) && !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}
export const selectionDisabledDelete = (selectedElements: Task[]) => {
  const selectedFiltered = selectedElements.filter(
    (_selected) => selectionIsArchive(_selected) && !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}
export const selectionDisabledMoveTo = (selectedElements: Task[]) => {
  const selectedFiltered = selectedElements.filter(
    (_selected) => !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}
export const selectionDisabledQueue = (selectedElements: Task[]) => {
  const selectedFiltered = selectedElements.filter(
    (_selected) =>
      _selected?.status === TaskStatusEnum.Queued && !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}
export const selectionDisabledViewWorker = (selectedElements: Task[]) => {
  const selectedFiltered = selectedElements.filter(
    (_selected) =>
      _selected?.status === TaskStatusEnum.InProgress && !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}
export const selectionDisabledContinue = (selectedElements: Task[]) => {
  const selectedFiltered = selectedElements.filter(
    (_selected) => canContinue(_selected) && !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}
export const selectionDisabledEnqueue = (selectedElements: Task[]) => {
  const selectedFiltered = selectedElements.filter(
    (_selected) => canEnqueue(_selected) && !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}
export const selectionDisabledDequeue = (selectedElements: Task[]) => {
  const selectedFiltered = selectedElements.filter(
    (_selected) => canDequeue(_selected) && !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}
export const selectionDisabledArchive = (selectedElements: Task[]) => {
  const selectedFiltered = selectedElements.filter(
    (_selected) => !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}
export const selectionDisabledTags = (selectedElements: Task[]) => {
  const selectedFiltered = selectedElements.filter(
    (_selected) => !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}
