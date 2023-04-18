import { Modal } from "antd"
import { useMenuCtx } from "@/views/projects/experiments/menu/MenuCtx"
import { selectionDisabledPublishTasks } from "@/views/projects/experiments/menu/items.utils"
import { Task } from "@/types/task"

export const PublishExperimentDialog = (props: {
  show: boolean
  onClose: (e: boolean, publish: Task[]) => void
}) => {
  const { show, onClose } = props
  const ctx = useMenuCtx()
  const filtered = selectionDisabledPublishTasks(
    ctx.ctxMode === "single" && ctx.target ? [ctx.target] : ctx.selectedTasks,
  )
  const multi = ctx.ctxMode === "multi" && filtered.available > 1
  const canPublish = filtered.selectedFiltered

  return (
    <Modal
      width={650}
      getContainer={() => document.body}
      open={show}
      onOk={() => onClose(true, canPublish)}
      onCancel={() => onClose(false, [])}
      title={<div></div>}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          <i className="al-ico-publish al-icon icon mx-auto xxl" />
        </div>
        <span className="commonDialogTitle">PUBLISH EXPERIMENTS</span>
        <p className="subDialogHeader" style={{ textAlign: "left" }}>
          <b>{`${
            multi
              ? `${ctx.selectedTasks.length} experiments`
              : filtered.available === 1
              ? canPublish[0].name
              : `"${ctx.target?.name}"`
          }`}</b>
          &nbsp; status will be set to Published.
          <br />
          <br />
          Published experiments are read-only and cannot be reset. The
          experiment&apos;s output, including models will also be published so
          that other experiments can use it.
        </p>
      </div>
    </Modal>
  )
}
