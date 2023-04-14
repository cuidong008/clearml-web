import { Checkbox, Modal } from "antd"
import { useState } from "react"
import { useMenuCtx } from "../menu/MenuCtx"

export const DeleteExperimentDialog = (props: {
  show: boolean
  onClose: (e: boolean, removeArtifacts: boolean) => void
}) => {
  const { show, onClose } = props
  const ctx = useMenuCtx()
  const [removeArtifacts, setRemoveArtifacts] = useState(true)
  const multi = ctx.ctxMode === "multi" && ctx.selectedTasks.length > 1

  return (
    <Modal
      width={550}
      getContainer={() => document.body}
      open={show}
      onOk={() => onClose(true, removeArtifacts)}
      onCancel={() => onClose(false, false)}
      title={<div></div>}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          <i className="al-ico-trash" style={{ fontSize: 60, height: 60 }} />
        </div>
        <span className="commonDialogTitle">
          {`DELETE EXPERIMENT${multi ? "S" : ""}`}
        </span>
        <p className="subDialogHeader" style={{ textAlign: "left" }}>
          Are you sure you want to delete&nbsp;
          <b>{`${
            multi
              ? `${ctx.selectedTasks.length} experiments`
              : `"${ctx.target?.name}"`
          }`}</b>
          ? This will also remove all captured logs, results, artifacts and
          debug samples.
        </p>
      </div>
      <Checkbox
        checked={removeArtifacts}
        onChange={(e) => setRemoveArtifacts(e.target.checked)}
        style={{ margin: "0 10px" }}
      />
      Remove all related artifacts and debug samples from ClearML file server
    </Modal>
  )
}
