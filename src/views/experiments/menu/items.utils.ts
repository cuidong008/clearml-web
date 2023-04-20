import { Task } from "@/types/task"
import { TaskStatusEnum, TaskTypeEnum } from "@/types/enums"
import { get } from "lodash"
import store from "@/store"

export const selectionAllIsArchive = (selectedTasks: Task[]) =>
  selectedTasks.every((s) => s?.system_tags?.includes("archived"))

export const selectionIsArchive = (selectedTasks: Task) =>
  selectedTasks?.system_tags?.includes("archived")

export const canEnqueue = (task: Task): boolean =>
  task &&
  (TaskStatusEnum.Created === task.status ||
    TaskStatusEnum.Stopped === task.status) &&
  task.type !== TaskTypeEnum.ManualAnnotation

export const canDequeue = (task: Task): boolean =>
  task && TaskStatusEnum.Queued === task.status

export const canContinue = (task: Task): boolean =>
  task &&
  [TaskStatusEnum.Created, TaskStatusEnum.Stopped].includes(
    task.status ?? "unknown",
  ) &&
  task.type !== TaskTypeEnum.ManualAnnotation &&
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

export const isSharedAndNotOwner = (
  item: Task,
  activeWorkSpace: { id?: string; name?: string },
): boolean =>
  !!item.system_tags?.includes("shared") &&
  !!item.company?.id &&
  !!activeWorkSpace?.id &&
  item.company.id !== activeWorkSpace.id

export const selectionDisabledEditable = (task?: Task) => {
  return (
    !!task &&
    task.status === TaskStatusEnum.Created &&
    !isReadOnly(task) &&
    !isSharedAndNotOwner(task, store.getState().app.user?.company ?? {})
  )
}

export const selectionDisabledAbort = (selectedTasks: Task[]) => {
  const selectedFiltered = selectedTasks.filter(
    (_selected) =>
      [TaskStatusEnum.Queued, TaskStatusEnum.InProgress].includes(
        _selected?.status ?? "unknown",
      ) &&
      !isReadOnly(_selected) &&
      _selected.user?.id === store.getState().app.user?.id,
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}

export const selectionDisabledPublishTasks = (selectedTasks: Task[]) => {
  const selectedFiltered = selectedTasks.filter(
    (_selected) =>
      [
        TaskStatusEnum.Stopped,
        TaskStatusEnum.Closed,
        "completed",
        TaskStatusEnum.Failed,
      ].includes(_selected?.status ?? "unknown") &&
      !isReadOnly(_selected) &&
      _selected.user?.id === store.getState().app.user?.id,
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}

export const selectionDisabledPublishModels = (selectedTasks: Task[]) => {
  const selectedFiltered = selectedTasks.filter(
    (_selected) => !isReadOnly(_selected) && !_selected?.ready,
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}

export const selectionDisabledReset = (selectedTasks: Task[]) => {
  const selectedFiltered = selectedTasks.filter(
    (_selected) =>
      ![
        TaskStatusEnum.Created,
        TaskStatusEnum.Published,
        TaskStatusEnum.Publishing,
      ].includes(_selected?.status ?? "unknown") &&
      !isReadOnly(_selected) &&
      _selected.user?.id === store.getState().app.user?.id,
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}

export const selectionDisabledAbortAllChildren = (selectedTasks: Task[]) => {
  const selectedFiltered = selectedTasks.filter(
    (_selected) =>
      [TaskTypeEnum.Controller, TaskTypeEnum.Optimizer].includes(
        _selected?.type ?? "unknown",
      ) && !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}

export const selectionDisabledDelete = (selectedTasks: Task[]) => {
  const selectedFiltered = selectedTasks.filter(
    (_selected) =>
      selectionIsArchive(_selected) &&
      !isReadOnly(_selected) &&
      _selected.user?.id === store.getState().app.user?.id,
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}

export const selectionDisabledMoveTo = (selectedTasks: Task[]) => {
  const selectedFiltered = selectedTasks.filter(
    (_selected) =>
      !isReadOnly(_selected) &&
      _selected.user?.id === store.getState().app.user?.id,
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}

export const selectionDisabledQueue = (selectedTasks: Task[]) => {
  const selectedFiltered = selectedTasks.filter(
    (_selected) =>
      _selected?.status === TaskStatusEnum.Queued && !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}

export const selectionDisabledViewWorker = (selectedTasks: Task[]) => {
  const selectedFiltered = selectedTasks.filter(
    (_selected) =>
      _selected?.status === TaskStatusEnum.InProgress && !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}

export const selectionDisabledContinue = (selectedTasks: Task[]) => {
  const selectedFiltered = selectedTasks.filter(
    (_selected) => canContinue(_selected) && !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}

export const selectionDisabledEnqueue = (selectedTasks: Task[]) => {
  const selectedFiltered = selectedTasks.filter(
    (_selected) => canEnqueue(_selected) && !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}

export const selectionDisabledDequeue = (selectedTasks: Task[]) => {
  const selectedFiltered = selectedTasks.filter(
    (_selected) => canDequeue(_selected) && !isReadOnly(_selected),
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}

export const selectionDisabledArchive = (selectedTasks: Task[]) => {
  const selectedFiltered = selectedTasks.filter(
    (_selected) =>
      !isReadOnly(_selected) &&
      _selected.user?.id === store.getState().app.user?.id,
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}

export const selectionDisabledTags = (selectedTasks: Task[]) => {
  const selectedFiltered = selectedTasks.filter(
    (_selected) =>
      !isReadOnly(_selected) &&
      _selected.user?.id === store.getState().app.user?.id,
  )
  return { selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered) }
}
