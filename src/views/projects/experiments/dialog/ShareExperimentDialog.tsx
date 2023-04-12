import { Button, message, Modal } from "antd"
import { CopyToClipboard } from "@/components/CopyToClipboard"
import styles from "./dialog.module.scss"
import { Task } from "@/types/task"
import { tasksUpdate } from "@/api/task"
import { useEffect, useState } from "react"

export const ShareExperimentDialog = (props: {
  show: boolean
  task?: Task
  onClose: (e: boolean) => void
}) => {
  const { show, task, onClose } = props
  const [shared, setShared] = useState(task?.system_tags?.includes("shared"))

  useEffect(() => {
    setShared(task?.system_tags?.includes("shared"))
  }, [task])

  function share() {
    tasksUpdate({
      task: task?.id ?? "",
      system_tags: shared
        ? task?.system_tags?.filter((v) => v !== "shared")
        : [...(task?.system_tags ?? []), "shared"],
    }).then(({ meta }) => {
      if (meta.result_code !== 200) {
        message.error(meta.result_msg)
        return
      }
      setShared(!shared)
    })
  }

  return (
    <Modal
      getContainer={() => document.body}
      width={650}
      open={show}
      onOk={() => onClose(false)}
      onCancel={() => onClose(false)}
      cancelButtonProps={{ style: { display: "none" } }}
      title={<div></div>}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          <i
            className="al-ico-get-link-dialog"
            style={{ fontSize: 60, height: 60 }}
          />
        </div>
        <span className="commonDialogTitle">SHARE EXPERIMENT PUBLICLY</span>
        {shared && (
          <p className="subDialogHeader" style={{ textAlign: "left" }}>
            <b>Any registered user with this link</b> has read-only access to
            this task and all it’s contents (Artifacts, Results, etc.)
          </p>
        )}
        {!shared && (
          <p className="subDialogHeader" style={{ textAlign: "left" }}>
            Create a shareable link to grant read access to
            <b> any registered user</b> you provide this link to.
          </p>
        )}
      </div>
      {shared && (
        <div className={styles.linkCopy}>
          <CopyToClipboard>
            <div className={styles.shareLink}>
              {`${location.origin}/projects/${task?.project?.id}/experiments/${task?.id}/full/details`}
            </div>
          </CopyToClipboard>
        </div>
      )}
      <div style={{ textAlign: "right" }}>
        <Button style={{ color: "#2af" }} onClick={() => share()} type="text">
          {shared ? "Remove" : "Create"} Link
        </Button>
      </div>
    </Modal>
  )
}
