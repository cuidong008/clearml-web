import { Task } from "@/types/task"
import { useNavigate } from "react-router-dom"
import { useStoreSelector, useThunkDispatch } from "@/store"
import { getTasksAllEx, tasksArchiveMany, tasksUnArchiveMany } from "@/api/task"
import { Button, message, notification } from "antd"
import { ArchivePopupId } from "@/utils/constant"
import { ShareExperimentDialog } from "../dialog/ShareExperimentDialog"
import { WarnArchiveDialog } from "../dialog/WarnArchiveDialog"
import { useState } from "react"
import { uploadUserPreference } from "@/store/app/app.actions"
import { ExperimentFooter } from "./ExperimentFooter"
import { ContextMenu } from "./ContextMenu"
import { useMenuCtx } from "./MenuCtx"
import { notificationMsg } from "@/utils/global"

interface ContextMenuProps {
  dispatch: (e: string, t?: Task, data?: any) => void
}

export const ExperimentMenu = (props: ContextMenuProps) => {
  const { dispatch: dispatchToParent } = props
  const ctx = useMenuCtx()
  const navigate = useNavigate()
  const viewConf = useStoreSelector((state) => state.app.preferences.views)
  const storeSelectedTask = useStoreSelector((state) => state.task.selectedTask)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showWarnDialog, setShowWarnDialog] = useState(false)
  const [notify, notifyContext] = notification.useNotification()
  const [msg, msgContext] = message.useMessage()
  const dispatchThunk = useThunkDispatch()

  function onMenuClick(e: string, t?: Task) {
    switch (e) {
      case "detail":
        dispatchToParent("detail", t)
        break
      case "view":
        navigate(`${t?.id}/full/details`)
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
        ctx.target?.system_tags?.includes("archived")
          ? doRestoreTask()
          : doArchiveTask()
        break
      case "delete":
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
      }).then(({ data, meta }) => {
        if (meta.result_code !== 200) {
          msg.error(meta.result_msg)
          return
        }
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
    }).then(({ data, meta }) => {
      if (meta.result_code !== 200) {
        msg.error(meta.result_msg)
        return
      }
      notify.open({
        type: data.failed?.length ? "error" : "success",
        message: "",
        description: notificationMsg(
          data.succeeded?.length ?? 0,
          data.failed?.length ?? 0,
          "experiment",
          "archive",
        ),
        btn: (
          <Button type="text" onClick={() => doRestoreTask()}>
            Undo
          </Button>
        ),
      })
      dispatchToParent("refresh")
    })
  }

  function doRestoreTask() {
    tasksUnArchiveMany({
      ids:
        ctx.ctxMode === "single"
          ? [ctx.target?.id ?? ""]
          : ctx.selectedTasks.map((t) => t.id),
    }).then(({ data, meta }) => {
      if (meta.result_code !== 200) {
        msg.error(meta.result_msg)
        return
      }
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
      dispatchToParent("refresh")
    })
  }

  function deleteTasks() {}

  return (
    <>
      <ShareExperimentDialog
        show={showShareDialog}
        task={ctx.target}
        onClose={() => setShowShareDialog(false)}
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
      {ctx.selectedTasks.length > 1 && <ExperimentFooter />}
    </>
  )
}
