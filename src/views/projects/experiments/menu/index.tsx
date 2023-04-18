import { Task } from "@/types/task"
import { useNavigate, useParams } from "react-router-dom"
import { useStoreSelector, useThunkDispatch } from "@/store"
import {
  getTasksAllEx,
  tasksArchiveMany,
  tasksClone,
  tasksDeleteMany,
  tasksMove,
  tasksPublishMany,
  tasksResetMany,
  tasksStopMany,
  tasksUnArchiveMany,
  tasksUpdate,
} from "@/api/task"
import { Button, message, notification } from "antd"
import { ArchivePopupId } from "@/utils/constant"
import { ShareExperimentDialog } from "../dialog/ShareExperimentDialog"
import { WarnArchiveDialog } from "../dialog/WarnArchiveDialog"
import { DeleteExperimentDialog } from "../dialog/DeleteExperimentDialog"
import { ResetExperimentDialog } from "../dialog/ResetExperimentDialog"
import { AbortExperimentDialog } from "../dialog/AbortExperimentDialog"
import React, { useState } from "react"
import { uploadUserPreference } from "@/store/app/app.actions"
import { ExperimentFooter } from "./ExperimentFooter"
import { ContextMenu } from "./ContextMenu"
import { useMenuCtx } from "./MenuCtx"
import { getUrlsPerProvider, notificationMsg } from "@/utils/global"
import { selectionDisabledAbort, selectionDisabledReset } from "./items.utils"
import { TasksUpdateResponse } from "@/api/models/task"
import { Result } from "@/api"
import { AbortAllExperimentDialog } from "@/views/projects/experiments/dialog/AbortAllExperimentDialog"
import { PublishExperimentDialog } from "@/views/projects/experiments/dialog/PublishExperimentDialog"
import { CloneExperimentDialog } from "@/views/projects/experiments/dialog/CloneExperimentDialog"
import { CloneData } from "@/types/common"
import { MoveExperimentDialog } from "@/views/projects/experiments/dialog/MoveExperimentDialog"

interface ContextMenuProps {
  dispatch: (e: string, t?: Task[]) => void
}

export const ExperimentMenu = (props: ContextMenuProps) => {
  const { dispatch: dispatchToParent } = props
  const ctx = useMenuCtx()
  const navigate = useNavigate()
  const params = useParams()
  const viewConf = useStoreSelector((state) => state.app.preferences.views)
  const storeSelectedTask = useStoreSelector((state) => state.task.selectedTask)

  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showWarnDialog, setShowWarnDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [showAbortDialog, setShowAbortDialog] = useState(false)
  const [showAbortAllDialog, setShowAbortAllDialog] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [showCloneDialog, setShowCloneDialog] = useState(false)
  const [showMoveDialog, setShowMoveDialog] = useState(false)

  const [notify, notifyContext] = notification.useNotification()
  const [msg, msgContext] = message.useMessage()
  const dispatchThunk = useThunkDispatch()

  function onMenuClick(e: string, from: string, data?: string) {
    if (from === "footer") {
      ctx.ctxMode = "multi"
      ctx.setCtx(ctx)
    }
    switch (e) {
      case "detail":
        dispatchToParent("detail", ctx.target ? [ctx.target] : [])
        break
      case "view":
        if (data === "full") {
          navigate(`${ctx.target?.id}/full/details`)
        } else {
          navigate(`${ctx.target?.id}/details`)
        }
        break
      case "mq":
        navigateToQueue()
        break
      case "viewWorker":
        navigate("/workers-and-queues/workers")
        break
      case "share":
        setShowShareDialog(true)
        break
      case "archive":
        ctx.ctxMode === "single"
          ? ctx.target?.system_tags?.includes("archived")
            ? doRestoreTask()
            : doArchiveTask()
          : ctx.selectedTasks.every((t) => t.system_tags?.includes("archived"))
          ? doRestoreTask()
          : doArchiveTask()
        break
      case "delete":
        setShowDeleteDialog(true)
        break
      case "reset":
        setShowResetDialog(true)
        break
      case "abort":
        setShowAbortDialog(true)
        break
      case "addTag":
        data &&
          (ctx.ctxMode === "multi"
            ? updateTasksTags(data)
            : updateTaskTags(data))
        break
      case "abortAll":
        setShowAbortAllDialog(true)
        break
      case "publish":
        setShowPublishDialog(true)
        break
      case "clone":
        setShowCloneDialog(true)
        break
      case "move":
        setShowMoveDialog(true)
        break
    }
  }

  function navigateToQueue() {
    if (
      ctx.target?.id === storeSelectedTask?.id &&
      storeSelectedTask?.execution?.queue?.id
    ) {
      navigate(`/workers-and-queues?id=${ctx.target?.execution?.queue?.id}`)
    } else {
      getTasksAllEx({
        id: [ctx.target?.id ?? ""],
        only_fields: ["execution.queue.id"],
      }).then(({ data }) => {
        if (data.tasks.length && data.tasks[0].execution?.queue?.id) {
          navigate(
            `/workers-and-queues?id=${data.tasks[0].execution?.queue?.id}`,
          )
        }
      })
    }
  }

  function doArchiveTask() {
    if (
      !viewConf?.neverShowPopupAgain.includes(ArchivePopupId) &&
      ctx.selectedTasks.some((t) => t.system_tags?.includes("shared"))
    ) {
      setShowWarnDialog(true)
    } else {
      doArchive()
    }
  }

  function doArchive() {
    tasksArchiveMany({
      ids:
        ctx.ctxMode === "single"
          ? [ctx.target?.id ?? ""]
          : ctx.selectedTasks.map((t) => t.id),
    })
      .then(({ data }) => {
        notify.open({
          type: data.failed?.length ? "error" : "success",
          message: "info",
          duration: 3,
          description: notificationMsg(
            data.succeeded?.length ?? 0,
            data.failed?.length ?? 0,
            "experiment",
            "archive",
          ),
          btn: data.failed?.length ? (
            <Button type="text">More Info</Button>
          ) : (
            <Button type="text" onClick={() => doRestoreTask()}>
              Undo
            </Button>
          ),
        })
        dispatchToParent("afterArchive")
      })
      .catch((e) => {
        console.log(e)
      })
  }

  function doRestoreTask() {
    tasksUnArchiveMany({
      ids:
        ctx.ctxMode === "single"
          ? [ctx.target?.id ?? ""]
          : ctx.selectedTasks.map((t) => t.id),
    }).then(({ data }) => {
      notify.open({
        type: data.failed?.length ? "error" : "success",
        message: "",
        description: notificationMsg(
          data.succeeded?.length ?? 0,
          data.failed?.length ?? 0,
          "experiment",
          "restore",
        ),
      })
      dispatchToParent("afterArchive")
    })
  }

  function deleteTasks(deleteArtifacts: boolean) {
    tasksDeleteMany({
      ids: ctx.selectedTasks.map((t) => t.id),
      delete_external_artifacts: deleteArtifacts,
      delete_output_models: deleteArtifacts,
      return_file_urls: true,
      force: true,
    })
      .then(({ data }) => {
        const deleteRes = {
          failed: data.failed,
          succeeded: data.succeeded,
          urlsToDelete: getUrlsPerProvider(
            data.succeeded
              ?.map((deletedExperiment) => [
                ...(deletedExperiment.urls?.artifact_urls ?? []),
                ...(deletedExperiment.urls?.event_urls ?? []),
                ...(deletedExperiment.urls?.model_urls ?? []),
              ])
              .flat() ?? [],
          ),
        }
        // TODO delete s3 files

        notify.open({
          type: data.failed?.length ? "error" : "success",
          message: "",
          description: notificationMsg(
            data.succeeded?.length ?? 0,
            data.failed?.length ?? 0,
            "experiment",
            "delete",
          ),
        })
        dispatchToParent("afterArchive")
      })
      .catch(() => {
        msg.error("delete task failure")
      })
  }

  function resetTasks(deleteArtifacts: boolean) {
    tasksResetMany({
      ids:
        ctx.ctxMode === "single" && ctx.target
          ? [ctx.target.id]
          : selectionDisabledReset(ctx.selectedTasks).selectedFiltered.map(
              (t) => t.id,
            ),
      delete_external_artifacts: deleteArtifacts,
      delete_output_models: deleteArtifacts,
      return_file_urls: true,
      force: true,
    })
      .then(({ data }) => {
        const resetRes = {
          failed: data.failed,
          succeeded: data.succeeded,
          urlsToDelete: getUrlsPerProvider(
            data.succeeded
              ?.map((deletedExperiment) => [
                ...(deletedExperiment.urls?.artifact_urls ?? []),
                ...(deletedExperiment.urls?.event_urls ?? []),
                ...(deletedExperiment.urls?.model_urls ?? []),
              ])
              .flat() ?? [],
          ),
        }
        // TODO delete s3 files

        notify.open({
          type: data.failed?.length ? "error" : "success",
          message: "",
          description: notificationMsg(
            data.succeeded?.length ?? 0,
            data.failed?.length ?? 0,
            "experiment",
            "reset",
          ),
        })
        dispatchToParent("afterReset")
      })
      .catch(() => {
        msg.error("reset task failure")
      })
  }

  function abortTasks() {
    tasksStopMany({
      ids:
        ctx.ctxMode === "single" && ctx.target
          ? [ctx.target.id]
          : selectionDisabledAbort(ctx.selectedTasks).selectedFiltered.map(
              (t) => t.id,
            ),
    })
      .then(({ data }) => {
        notify.open({
          type: data.failed?.length ? "error" : "success",
          message: "",
          description: notificationMsg(
            data.succeeded?.length ?? 0,
            data.failed?.length ?? 0,
            "experiment",
            "abort",
          ),
        })
        dispatchToParent("afterReset")
      })
      .catch(() => {
        msg.error("abort task failure")
      })
  }

  function updateTasksTags(tag: string) {
    const allRequest = ctx.selectedTasks.map((t) =>
      tasksUpdate({
        task: t.id,
        tags: [...(t.tags ?? []), tag],
      }),
    )
    Promise.allSettled(allRequest)
      .then(([...resp]) => {
        for (let i = 0; i < resp.length; i++) {
          if (resp[i].status === "fulfilled") {
            const { value } = resp[i] as PromiseFulfilledResult<
              Result<TasksUpdateResponse>
            >
            ctx.selectedTasks[i] = {
              ...ctx.selectedTasks[i],
              ...value.data.fields,
            }
          }
        }
        dispatchToParent("updateMany", ctx.selectedTasks)
      })
      .catch(() => {
        msg.error("update tags for all selected experiments failure")
      })
  }

  function updateTaskTags(tag: string) {
    if (!ctx.target) {
      return
    }
    tasksUpdate({
      task: ctx.target.id,
      tags: [...(ctx.target.tags ?? []), tag],
    })
      .then(({ data }) => {
        ctx.target &&
          dispatchToParent("updateSelected", [
            { ...ctx.target, ...data.fields },
          ])
      })
      .catch(() => {
        msg.error("tags update failure")
      })
  }

  function publishTasks(needPublish: Task[]) {
    tasksPublishMany({
      ids: needPublish.map((t) => t.id),
    })
      .then(({ data }) => {
        msg.open({
          content: notificationMsg(
            data.succeeded?.length ?? 0,
            data.failed?.length ?? 0,
            "experiment",
            "publish",
          ),
          type: data.failed?.length ? "error" : "success",
        })
        dispatchToParent("afterReset")
      })
      .catch(() => {
        msg.error("publish tasks failure")
      })
  }

  function abortsAll(aborts: Task[]) {
    tasksStopMany({
      ids: aborts.map((t) => t.id),
    })
      .then(({ data }) => {
        msg.open({
          content: notificationMsg(
            data.succeeded?.length ?? 0,
            data.failed?.length ?? 0,
            "experiment",
            "abort all children",
          ),
          type: data.failed?.length ? "error" : "success",
        })
        dispatchToParent("afterReset")
      })
      .catch(() => {
        msg.error("abort task's children failure")
      })
  }

  function taskClone(cloneData: CloneData) {
    console.log(cloneData)
    tasksClone({
      task: ctx.target?.id ?? "",
      new_task_project: cloneData.project,
      new_task_comment: cloneData.description,
      new_task_name: cloneData.name,
      new_project_name: cloneData.newProjectName,
    }).then(({ data }) => {
      if (data.new_project) {
        navigate(
          `/projects/${data.new_project.id}/experiments/${data.id}/details`,
        )
      } else {
        navigate(
          `/projects/${params["projId"]}/experiments/${data.id}/details`,
          { replace: true },
        )
      }
      dispatchToParent("afterReset")
    })
  }

  function tasksMoveToProject(isNew: boolean, project: string) {
    tasksMove({
      ids:
        ctx.ctxMode === "multi"
          ? ctx.selectedTasks.map((t) => t.id)
          : [ctx.target?.id ?? ""],
      project: isNew ? "" : project,
      project_name: isNew ? project : "",
    }).then(({ data }) => {
      navigate(`/projects/${data.project_id}/experiments`, { replace: true })
    })
  }

  return (
    <>
      <MoveExperimentDialog
        show={showMoveDialog}
        onClose={(e, target) => {
          setShowMoveDialog(false)
          target && tasksMoveToProject(target.isNew, target.project)
        }}
      />
      <CloneExperimentDialog
        show={showCloneDialog}
        onClose={(e) => {
          setShowCloneDialog(false)
          e && taskClone(e)
        }}
      />
      <PublishExperimentDialog
        show={showPublishDialog}
        onClose={(e, needPublish) => {
          setShowPublishDialog(false)
          e && publishTasks(needPublish)
        }}
      />
      <AbortAllExperimentDialog
        show={showAbortAllDialog}
        onClose={(e, aborts) => {
          setShowAbortAllDialog(false)
          e && abortsAll(aborts)
        }}
      />
      <AbortExperimentDialog
        show={showAbortDialog}
        onClose={(e) => {
          setShowAbortDialog(false)
          e && abortTasks()
        }}
      />
      <DeleteExperimentDialog
        show={showDeleteDialog}
        onClose={(e, deleteArtifacts) => {
          setShowDeleteDialog(false)
          e && deleteTasks(deleteArtifacts)
        }}
      />
      <ResetExperimentDialog
        show={showResetDialog}
        onClose={(e, deleteArtifacts) => {
          setShowResetDialog(false)
          e && resetTasks(deleteArtifacts)
        }}
      />
      <ShareExperimentDialog
        show={showShareDialog}
        onClose={(e) => {
          setShowShareDialog(false)
          e &&
            dispatchToParent("updateSelected", ctx.target ? [ctx.target] : [])
        }}
      />
      <WarnArchiveDialog
        show={showWarnDialog}
        onClose={(e, neverShowPopup) => {
          setShowWarnDialog(false)
          if (e) {
            if (neverShowPopup) {
              dispatchThunk(
                uploadUserPreference("views", {
                  ...viewConf,
                  neverShowPopupAgain: [
                    ...(viewConf?.neverShowPopupAgain ?? []),
                    ArchivePopupId,
                  ],
                }),
              )
            }
            doArchive()
          }
        }}
      />
      {notifyContext}
      {msgContext}
      {ctx.target && <ContextMenu onItemClick={onMenuClick} />}
      {ctx.selectedTasks.length > 1 && (
        <ExperimentFooter onItemClick={onMenuClick} />
      )}
    </>
  )
}
