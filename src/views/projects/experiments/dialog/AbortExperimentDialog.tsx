import { Modal } from "antd"
import { useMenuCtx } from "../menu/MenuCtx"
import { selectionDisabledAbort } from "../menu/items.utils"

export const AbortExperimentDialog = (props: {
  show: boolean
  onClose: (e: boolean) => void
}) => {
  const { show, onClose } = props
  const ctx = useMenuCtx()
  const filtered = selectionDisabledAbort(
    ctx.ctxMode === "single" && ctx.target ? [ctx.target] : ctx.selectedTasks,
  )
  const multi = ctx.ctxMode === "multi" && filtered.available > 1
  const canAbort = filtered.selectedFiltered

  return (
    <Modal
      width={550}
      getContainer={() => document.body}
      open={show}
      onOk={() => onClose(true)}
      onCancel={() => onClose(false)}
      title={<div></div>}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          <i className="al-ico-abort" style={{ fontSize: 60, height: 60 }} />
        </div>
        <span className="commonDialogTitle">ABORT</span>
        <p className="subDialogHeader" style={{ textAlign: "left" }}>
          <b>{`${
            multi
              ? `${ctx.selectedTasks.length} experiments`
              : filtered.available === 1
              ? canAbort[0].name
              : `"${ctx.target?.name}"`
          }`}</b>
          &nbsp;will be stopped and additional model updates will not be
          allowed..
        </p>
      </div>
    </Modal>
  )
}
