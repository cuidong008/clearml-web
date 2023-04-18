import { useMenuCtx } from "../menu/MenuCtx"
import { Form, Input, Modal, Select } from "antd"
import { useEffect, useRef, useState } from "react"
import { projectsGetAllExCanClone } from "@/api/project"
import { Project } from "@/types/project"
import { useStoreSelector } from "@/store"
import { CloneData, Opt } from "@/types/common"

export const CloneExperimentDialog = (props: {
  show: boolean
  onClose: (clone?: CloneData) => void
}) => {
  const { show, onClose } = props
  const selectedProject = useStoreSelector(
    (state) => state.project.selectedProject,
  )
  const ctx = useMenuCtx()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectOpt, setSelectOpt] = useState<Opt[]>([])
  const [disabled, setDisabled] = useState(false)
  const [form] = Form.useForm()
  const ref = useRef(null)

  useEffect(() => {
    if (show && ref.current) {
      form.resetFields()
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
          form.setFieldsValue({
            description: "",
            name: `Clone Of ${ctx.target?.name}`,
            project: selectedProject?.id ?? "",
          })
          setDisabled(false)
        } else {
          setDisabled(true)
        }
      })
    }
  }, [show, selectedProject, ref])

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

  function cloneConfirm() {
    form.validateFields().then((values) => {
      const existProject = projects.some((p) => p.id === values.project)
      if (!existProject) {
        values.newProjectName = values.project
        values.project = ""
      }
      onClose(values)
    })
  }

  return (
    <Modal
      width={650}
      getContainer={() => document.body}
      open={show}
      onOk={() => cloneConfirm()}
      okButtonProps={{ disabled: disabled }}
      onCancel={() => onClose()}
      title={<div></div>}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          <i className="al-ico-clone al-icon icon mx-auto xxl" />
        </div>
        <span className="commonDialogTitle">CLONE EXPERIMENT</span>
        <p className="subDialogHeader" style={{ textAlign: "left" }}>
          A draft copy of&nbsp;<b>&quot;{ctx.target?.name}&quot;</b>
          &nbsp;will be created.
        </p>
      </div>
      <Form
        ref={ref}
        form={form}
        layout="vertical"
        style={{ padding: 10 }}
        initialValues={{ name: "", description: "", project: "" }}
      >
        <Form.Item label="Project" required name="project">
          <Select
            allowClear
            showSearch
            optionFilterProp="data"
            optionLabelProp="data"
            style={{ width: "100%" }}
            onSearch={(text) => setSelectOpt(getPanelValue(text))}
            options={selectOpt}
          />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              validator: (_, value, callback) => {
                if (value === ctx.target?.name) {
                  callback("Can't same with origin experiment name ")
                  return
                }
                if (!value && value.startsWith(" ")) {
                  callback(
                    "New task name is required or can not start with blank",
                  )
                  return
                }
                callback()
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea
            style={{ height: 80, resize: "none" }}
            autoSize={false}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
