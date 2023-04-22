import { EditableSection } from "../shared/EditableSection"
import { Button, Form, Input, Modal, Select } from "antd"
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
  const [showWarnDialog, setShowWarnDialog] = useState(false)
  const [dialogContent, setDialogContent] = useState({
    type: "",
    title: "",
    content: "",
  })

  const [sourceForm] = Form.useForm()
  const [containerForm] = Form.useForm()
  const [outputForm] = Form.useForm()

  useEffect(() => {
    setCurData(() => ctx.current)
    const script = ctx.current?.script
    sourceForm.setFieldsValue(ctx.current?.script)
    containerForm.setFieldsValue(ctx.current?.container)
    outputForm.setFieldsValue(ctx.current?.output)
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

  function taskScriptEditAction(field: string, value?: string | object) {
    if (!curData) {
      return
    }
    tasksEdit({
      task: curData.id,
      script: { ...curData?.script, ...{ [field]: value } },
    })
      .then(({ data }) => {
        if (data.updated) {
          ctx.setCurrent({ ...curData, ...data.fields })
        }
      })
      .catch(() => {})
  }

  function taskContainerEditAction(field: string, value?: string) {
    if (!curData) {
      return
    }
    tasksEdit({
      task: curData.id,
      container: { ...curData?.container, ...{ [field]: value } },
    })
      .then(({ data }) => {
        if (data.updated) {
          ctx.setCurrent({ ...curData, ...data.fields })
        }
      })
      .catch(() => {})
  }

  function saveContainerConf() {
    return new Promise<boolean>((resolve, reject) => {
      containerForm
        .validateFields()
        .then((values) => {
          if (!curData) {
            reject(false)
            return
          }
          tasksEdit({
            task: curData.id,
            container: { ...curData?.container, ...values },
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

  function saveOutputConf() {
    return new Promise<boolean>((resolve, reject) => {
      outputForm
        .validateFields()
        .then((values) => {
          if (!curData) {
            reject(false)
            return
          }
          tasksEdit({
            task: curData.id,
            output_dest: values.destination,
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
      <Modal
        open={showWarnDialog}
        onCancel={() => setShowWarnDialog(false)}
        onOk={() => {
          setShowWarnDialog(false)
          switch (dialogContent.type) {
            case "diff":
              taskScriptEditAction("diff", "")
              break
            case "packages":
              taskScriptEditAction("requirements", {})
              break
            case "container":
              taskContainerEditAction("setup_shell_script", "")
          }
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div>
            <i className="al-ico-trash al-icon icon mx-auto xxl" />
          </div>
          <span className="commonDialogTitle">{dialogContent.title}</span>
          <p className="subDialogHeader" style={{ textAlign: "left" }}>
            {dialogContent.content}
          </p>
        </div>
      </Modal>
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
          <Button
            className={classNames(styles.panelBtn)}
            onClick={() => {
              setShowWarnDialog(true)
              setDialogContent({
                type: "diff",
                title: "DISCARD DIFF",
                content: "Uncommitted changes will be discarded",
              })
            }}
          >
            DISCARD DIFFS
          </Button>
        }
        style={{ maxHeight: 320 }}
        emptyText={"No changes logged"}
        editable={selectionDisabledEditable(curData)}
        onEdit={(e) => (e ? setEditSection("changes") : setEditSection(""))}
        onSave={(e?: string) => taskScriptEditAction("diff", e)}
      />
      <EditableTextView
        text={curData?.script?.requirements?.pip}
        label={"INSTALLED PACKAGES"}
        customBtn={
          <Button
            className={classNames(styles.panelBtn)}
            onClick={() => {
              setShowWarnDialog(true)
              setDialogContent({
                type: "packages",
                title: "CLEAR INSTALLED PACKAGES",
                content:
                  "Are you sure you want to clear the entire contents of Installed packages?",
              })
            }}
          >
            CLEAR
          </Button>
        }
        style={{ maxHeight: 320 }}
        emptyText={"Packages will be installed from projects requirements file"}
        editable={selectionDisabledEditable(curData)}
        onEdit={(e) => (e ? setEditSection("packages") : setEditSection(""))}
        onSave={(e?: string) =>
          taskScriptEditAction("requirements", {
            ...curData?.script?.requirements,
            pip: e,
          })
        }
      />
      <EditableSection
        editable={selectionDisabledEditable(curData)}
        label={<h4>CONTAINER</h4>}
        style={{ paddingBottom: 0 }}
        onEdit={(e) => (e ? setEditSection("container") : setEditSection(""))}
        onSave={() => saveContainerConf()}
      >
        <Form labelAlign="left" preserve colon={false} form={containerForm}>
          <Form.Item label="IMAGE" name="image">
            {editSection === "container" ? (
              <Input></Input>
            ) : (
              <div>{curData?.container?.image}</div>
            )}
          </Form.Item>
          <Form.Item label="ARGUMENTS" name="arguments">
            {editSection === "container" ? (
              <Input></Input>
            ) : (
              <div>{curData?.container?.arguments}</div>
            )}
          </Form.Item>
        </Form>
      </EditableSection>
      <EditableTextView
        editable={selectionDisabledEditable(curData)}
        label={
          <h4 style={{ fontWeight: 500, color: "#71758A", fontSize: 11 }}>
            SETUP SHELL SCRIPT
          </h4>
        }
        customBtn={
          <Button
            className={classNames(styles.panelBtn)}
            onClick={() => {
              setShowWarnDialog(true)
              setDialogContent({
                type: "container",
                title: "CLEAR SETUP SHELL SCRIPT",
                content:
                  "Are you sure you want to clear the entire contents of Setup shell script?",
              })
            }}
          >
            CLEAR
          </Button>
        }
        text={curData?.container?.setup_shell_script}
        emptyText={"No changes logged"}
        onEdit={(e) => (e ? setEditSection("shell") : setEditSection(""))}
        onSave={(e) => taskContainerEditAction("setup_shell_script", e)}
      />
      <EditableSection
        editable={selectionDisabledEditable(curData)}
        label={<h4>OUTPUT</h4>}
        onEdit={(e) => (e ? setEditSection("output") : setEditSection(""))}
        onSave={() => saveOutputConf()}
      >
        <Form labelAlign="left" preserve colon={false} form={outputForm}>
          <Form.Item label="DESTINATION" name="destination">
            {editSection === "output" ? (
              <Input></Input>
            ) : (
              <div>{curData?.output?.destination ?? ""}</div>
            )}
          </Form.Item>
          <Form.Item label="LOG LEVEL">
            <div>{curData?.output?.error ?? "basic"}</div>
          </Form.Item>
        </Form>
      </EditableSection>
    </div>
  )
}
