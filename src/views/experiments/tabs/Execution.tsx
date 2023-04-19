import { EditableSection } from "../shared/EditableSection"
import { Button, Form, Input, Select } from "antd"
import { useDetailCtx } from "@/views/experiments/details/DetailContext"
import React, { useEffect, useState } from "react"
import { Script, Task } from "@/types/task"
import { tasksEdit } from "@/api/task"
import { selectionDisabledEditable } from "@/views/experiments/menu/items.utils"
import { EditableTextView } from "@/views/experiments/shared/EditableTextView"
import classNames from "classnames"
import styles from "@/views/experiments/shared/EditableTextView/index.module.scss"

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
        script?.version_num
          ? "version_num"
          : script?.branch
          ? "branch"
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
        editable={selectionDisabledEditable(curData)}
        onEdit={(e) => {
          if (e) {
            setEditSection("source")
          } else {
            setEditSection("")
            setScriptType(
              curData?.script?.version_num
                ? "version_num"
                : curData?.script?.branch
                ? "branch"
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
              <div>{`${curData?.script?.[scriptType] ?? ""}${
                scriptType === "version_num" && curData?.script?.branch
                  ? ` (in branch ${curData.script.branch})`
                  : ""
              }`}</div>
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
      <EditableTextView
        text={curData?.script?.diff}
        label={"UNCOMMITTED CHANGES"}
        customBtn={
          <Button className={classNames(styles.panelBtn)}>DISCARD DIFFS</Button>
        }
        editable={selectionDisabledEditable(curData)}
        onEdit={(e) => (e ? setEditSection("changes") : setEditSection(""))}
      />
      <EditableTextView
        text={curData?.script?.requirements?.pip}
        label={"INSTALLED PACKAGES"}
        customBtn={
          <Button className={classNames(styles.panelBtn)}>CLEAR</Button>
        }
        editable={selectionDisabledEditable(curData)}
        onEdit={(e) => (e ? setEditSection("packages") : setEditSection(""))}
      />
      <EditableSection
        editable={selectionDisabledEditable(curData)}
        label={<h4>CONTAINER</h4>}
        onEdit={(e) => (e ? setEditSection("container") : setEditSection(""))}
      >
        <h4></h4>
      </EditableSection>
      <EditableSection
        editable={selectionDisabledEditable(curData)}
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
        editable={selectionDisabledEditable(curData)}
        label={<h4>OUTPUT</h4>}
        onEdit={(e) => (e ? setEditSection("output") : setEditSection(""))}
      >
        <div></div>
      </EditableSection>
    </div>
  )
}
