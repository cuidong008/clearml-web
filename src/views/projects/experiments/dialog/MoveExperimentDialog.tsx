import { useStoreSelector } from "@/store"
import { useMenuCtx } from "@/views/projects/experiments/menu/MenuCtx"
import { useEffect, useState } from "react"
import { Project } from "@/types/project"
import { Form, message, Modal, Select } from "antd"
import { projectsGetAllExCanClone } from "@/api/project"
import { Opt } from "@/types/common"
import { selectionDisabledMoveTo } from "@/views/projects/experiments/menu/items.utils"

export const MoveExperimentDialog = (props: {
  show: boolean
  onClose: (e: boolean, target?: { isNew: boolean; project: string }) => void
}) => {
  const { show, onClose } = props
  const selectedProject = useStoreSelector(
    (state) => state.project.selectedProject,
  )
  const ctx = useMenuCtx()
  const filtered = selectionDisabledMoveTo(
    ctx.ctxMode === "single" && ctx.target ? [ctx.target] : ctx.selectedTasks,
  )
  const multi = ctx.ctxMode === "multi" && filtered.available > 1
  const canMove = filtered.selectedFiltered
  const [projects, setProjects] = useState<Project[]>([])
  const [selectOpt, setSelectOpt] = useState<Opt[]>([])
  const [disabled, setDisabled] = useState(false)
  const [targetProj, setTargetProj] = useState("")
  const [msg, msgContext] = message.useMessage()

  useEffect(() => {
    if (show) {
      setTargetProj("")
      projectsGetAllExCanClone().then(({ data }) => {
        if (data.projects.length) {
          setProjects(() => data.projects)
          setSelectOpt(() =>
            data.projects.map((p) => ({
              label: p.name,
              data: p.name,
              value: p.id,
            })),
          )
          setDisabled(false)
        } else {
          setDisabled(true)
        }
      })
    }
  }, [show, selectedProject])

  function getPanelValue(data: string) {
    let options = projects.map((p) => ({
      label: p.name,
      value: p.id,
      data: p.name,
    }))
    if (data) {
      options = options.filter((v) => v.label.includes(data))
      if (options.length === 0) {
        options.unshift({
          label: `${data} (Create New)`,
          data: data,
          value: data,
        })
      }
    }
    return options
  }

  function confirmDialog() {
    const existProject = projects.some((p) => p.id === targetProj)
    if (
      targetProj === selectedProject?.id ||
      targetProj === selectedProject?.name
    ) {
      msg.warning("target project can't be current project")
      return
    }
    onClose(true, { isNew: !existProject, project: targetProj })
  }

  return (
    <Modal
      width={650}
      getContainer={() => document.body}
      open={show}
      onOk={() => confirmDialog()}
      okButtonProps={{ disabled: disabled || !targetProj }}
      onCancel={() => onClose(false)}
      title={<div></div>}
    >
      {msgContext}
      <div style={{ textAlign: "center" }}>
        <div>
          <i className="al-ico-move-to al-icon icon mx-auto xxl" />
        </div>
        <span className="commonDialogTitle">MOVE TO PROJECT</span>
        <p className="subDialogHeader" style={{ textAlign: "left" }}>
          <b>{`${
            multi
              ? `${ctx.selectedTasks.length} experiments`
              : filtered.available === 1
              ? canMove[0].name
              : `"${ctx.target?.name}"`
          }`}</b>
          &nbsp;will be moved from <b>{selectedProject?.name}</b>&nbsp;to the
          selected project.
        </p>
      </div>
      <Form layout="vertical" style={{ padding: 10 }}>
        <Form.Item label="Project" required>
          <Select
            allowClear
            showSearch
            optionFilterProp="data"
            optionLabelProp="data"
            value={targetProj}
            onChange={(e) => setTargetProj(e)}
            style={{ width: "100%" }}
            onSearch={(text) => setSelectOpt(getPanelValue(text))}
            options={selectOpt}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
