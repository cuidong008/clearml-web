import { Button, Modal } from "antd"
import { CopyToClipboard } from "@/components/CopyToClipboard"
import styles from "./dialog.module.scss"
import { tasksUpdate } from "@/api/task"
import { useEffect, useState } from "react"
import { useMenuCtx } from "../menu/MenuCtx"

export const ShareExperimentDialog = (props: {
  show: boolean
  onClose: (e: boolean) => void
}) => {
  const { show, onClose } = props
  const ctx = useMenuCtx()
  const [shared, setShared] = useState(
    ctx.target?.system_tags?.includes("shared"),
  )

  useEffect(() => {
    setShared(ctx.target?.system_tags?.includes("shared"))
  }, [ctx.target])

  function share() {
    if (!ctx.target) {
      return
    }
    tasksUpdate({
      task: ctx.target.id ?? "",
      system_tags: shared
        ? ctx.target.system_tags?.filter((v) => v !== "shared")
        : [...(ctx.target.system_tags ?? []), "shared"],
    }).then(({ data }) => {
      setShared(!shared)
      ctx.target &&
        ctx.setCtx({ ...ctx, target: { ...ctx.target, ...data.fields } })
    })
  }

  return (
    <Modal
      getContainer={() => document.body}
      width={650}
      open={show}
      onOk={() => onClose(true)}
      onCancel={() => onClose(false)}
      cancelButtonProps={{ style: { display: "none" } }}
      title={<div></div>}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          <i className="al-ico-get-link-dialog al-icon icon mx-auto xxl" />
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
              {`${location.origin}/projects/${ctx.target?.project?.id}/experiments/${ctx.target?.id}/full/details`}
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
