import { Checkbox, Modal } from "antd"
import { useState } from "react"
import { useMenuCtx } from "../menu/MenuCtx"
import { selectionDisabledReset } from "../menu/items.utils"

export const ResetExperimentDialog = (props: {
  show: boolean
  onClose: (e: boolean, removeArtifacts: boolean) => void
}) => {
  const { show, onClose } = props
  const ctx = useMenuCtx()
  const [removeArtifacts, setRemoveArtifacts] = useState(true)
  const filtered = selectionDisabledReset(
    ctx.ctxMode === "single" && ctx.target ? [ctx.target] : ctx.selectedTasks,
  )
  const multi = ctx.ctxMode === "multi" && filtered.available > 1
  const canAbort = filtered.selectedFiltered

  return (
    <Modal
      width={600}
      getContainer={() => document.body}
      open={show}
      onOk={() => onClose(true, removeArtifacts)}
      onCancel={() => onClose(false, false)}
      title={<div></div>}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          <i className="i-alert" style={{ width: 60, height: 60 }} />
        </div>
        <span className="commonDialogTitle">
          {`RESET EXPERIMENT${multi ? "S" : ""}`}
        </span>
        <p className="subDialogHeader" style={{ textAlign: "left" }}>
          <b>{`${
            multi
              ? `${ctx.selectedTasks.length} experiments`
              : filtered.available === 1
              ? canAbort[0].name
              : `"${ctx.target?.name}"`
          }`}</b>
          &nbsp;will be reset.
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
