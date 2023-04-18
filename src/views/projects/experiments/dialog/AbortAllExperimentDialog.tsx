import { Modal } from "antd"
import { selectionDisabledAbortAllChildren } from "../menu/items.utils"
import { useMenuCtx } from "../menu/MenuCtx"
import { getTasksAllEx } from "@/api/task"
import { TaskStatusEnum } from "@/types/enums"
import { useEffect, useState } from "react"
import { Task } from "@/types/task"

export const AbortAllExperimentDialog = (props: {
  show: boolean
  onClose: (e: boolean, aborts: Task[]) => void
}) => {
  const { show, onClose } = props
  const ctx = useMenuCtx()
  const filtered = selectionDisabledAbortAllChildren(
    ctx.ctxMode === "single" && ctx.target ? [ctx.target] : ctx.selectedTasks,
  )
  const [canAborts, setCanAborts] = useState<Task[]>([])
  const [isQueried, setIsQueried] = useState(false)

  useEffect(() => {
    if (show && filtered.available > 0) {
      getTasksAllEx({
        page_size: 2000,
        only_fields: ["name", "status"],
        status: [TaskStatusEnum.Queued, TaskStatusEnum.InProgress],
        parent: filtered.selectedFiltered.map((t) => t.id),
      }).then(({ data }) => {
        if (data.tasks.length) {
          setCanAborts(() => data.tasks)
        }
        setIsQueried(true)
      })
    } else {
      setIsQueried(false)
    }
  }, [show, filtered])

  return (
    <Modal
      width={550}
      getContainer={() => document.body}
      open={show}
      onOk={() => onClose(true, canAborts.concat(filtered.selectedFiltered))}
      onCancel={() => onClose(false, [])}
      okButtonProps={{ disabled: !canAborts.length }}
      title={<div></div>}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          <i
            className="al-ico-abort-all"
            style={{ fontSize: 60, height: 60 }}
          />
        </div>
        <span className="commonDialogTitle">ABORT CHILD TASKS</span>
        <p className="subDialogHeader" style={{ textAlign: "left" }}>
          {canAborts.length ? (
            <>
              This will abort all <b>{canAborts.length} </b> running child tasks
            </>
          ) : isQueried ? (
            <>Couldn&apos;t find any child running tasks</>
          ) : (
            <b>Looking for child running tasks...</b>
          )}
        </p>
      </div>
    </Modal>
  )
}
