import { EditableSection } from "../shared/EditableSection"
import { Form, Input, Select } from "antd"
import { useDetailCtx } from "@/views/experiments/details/DetailContext"
import { useEffect, useState } from "react"
import { Script, Task } from "@/types/task"
import { tasksEdit } from "@/api/task"

const scriptOptions = [
  {
    label: "Commit Id",
    value: "version_num",
  },
  {
    label: "Tag name",
    value: "tag",
  },
  {
    label: "Last Commit in Branch",
    value: "branch",
  },
]
const emptyScript = {
  version_num: "",
  tag: "",
  branch: "",
}
export const Execution = () => {
  const ctx = useDetailCtx()
  const [editSection, setEditSection] = useState("")
  const [curData, setCurData] = useState<Task>()
  const [scriptType, setScriptType] = useState<keyof Script>("version_num")
  const [sourceForm] = Form.useForm()

  useEffect(() => {
    setCurData(() => ctx.current)
    const script = ctx.current?.script
    sourceForm.setFieldsValue(ctx.current?.script)
    if (script) {
      setScriptType(
        script?.branch
          ? "branch"
          : script?.version_num
          ? "version_num"
          : script?.tag
          ? "tag"
          : "version_num",
      )
    }
  }, [ctx.current])

  function saveScriptConf() {
    return new Promise<boolean>((resolve, reject) => {
      sourceForm
        .validateFields()
        .then((values) => {
          if (!curData) {
            reject(false)
            return
          }
          tasksEdit({
            task: curData.id,
            script: { ...curData?.script, ...emptyScript, ...values },
          })
            .then(({ data }) => {
              if (data.updated) {
                ctx.setCurrent({ ...curData, ...data.fields })
              }
              resolve(true)
            })
            .catch(() => {
              reject(false)
            })
        })
        .catch(() => {
          reject(false)
        })
    })
  }

  return (
    <div>
      <EditableSection
        label={<h4>SOURCE CODE</h4>}
        editable={true}
        onEdit={(e) => {
          if (e) {
            setEditSection("source")
          } else {
            setEditSection("")
            setScriptType(
              curData?.script?.branch
                ? "branch"
                : curData?.script?.version_num
                ? "version_num"
                : curData?.script?.tag
                ? "tag"
                : "version_num",
            )
          }
        }}
        onSave={() => saveScriptConf()}
      >
        <Form labelAlign="left" preserve colon={false} form={sourceForm}>
          <Form.Item label="REPOSITORY" name="repository">
            {editSection === "source" ? (
              <Input></Input>
            ) : (
              <div>{curData?.script?.repository}</div>
            )}
          </Form.Item>
          <Form.Item
            label={
              scriptType === "version_num"
                ? "COMMIT ID"
                : scriptType === "tag"
                ? "TAG NAME"
                : "BRANCH"
            }
          >
            {editSection === "source" ? (
              <div className="inlineEdit" style={{ display: "flex", gap: 10 }}>
                <Form.Item>
                  <Select
                    options={scriptOptions}
                    value={scriptType}
                    onChange={(e) => setScriptType(e)}
                    style={{ width: 200 }}
                  />
                </Form.Item>
                <Form.Item
                  rules={[{ required: true }]}
                  name={scriptType}
                  style={{ flex: 1 }}
                >
                  <Input />
                </Form.Item>
              </div>
            ) : (
              <div>{`${curData?.script?.[scriptType] ?? ""}`}</div>
            )}
          </Form.Item>
          <Form.Item label="SCRIPT PATH" name="entry_point">
            {editSection === "source" ? (
              <Input></Input>
            ) : (
              <div>{curData?.script?.entry_point}</div>
            )}
          </Form.Item>
          <Form.Item label="WORKING DIRECTORY" name="working_dir">
            {editSection === "source" ? (
              <Input></Input>
            ) : (
              <div>{curData?.script?.working_dir}</div>
            )}
          </Form.Item>
        </Form>
      </EditableSection>
      <EditableSection
        label={<h4>UNCOMMITTED CHANGES</h4>}
        editable={true}
        onEdit={(e) => (e ? setEditSection("changes") : setEditSection(""))}
      >
        <div></div>
      </EditableSection>
      <EditableSection
        editable={true}
        label={<h4>CONTAINER</h4>}
        onEdit={(e) => (e ? setEditSection("container") : setEditSection(""))}
      >
        <h4></h4>
      </EditableSection>
      <EditableSection
        editable={true}
        label={<h4>INSTALLED PACKAGES</h4>}
        onEdit={(e) => (e ? setEditSection("packages") : setEditSection(""))}
      >
        <div></div>
      </EditableSection>
      <EditableSection
        editable={true}
        label={
          <h4 style={{ fontWeight: 500, color: "#71758A", fontSize: 11 }}>
            SETUP SHELL SCRIPT
          </h4>
        }
        onEdit={(e) => (e ? setEditSection("shell") : setEditSection(""))}
      >
        <div></div>
      </EditableSection>
      <EditableSection
        editable={true}
        label={<h4>OUTPUT</h4>}
        onEdit={(e) => (e ? setEditSection("output") : setEditSection(""))}
      >
        <div></div>
      </EditableSection>
    </div>
  )
}
