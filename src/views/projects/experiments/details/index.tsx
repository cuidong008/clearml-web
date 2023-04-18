import { useNavigate, useParams } from "react-router-dom"
import styles from "./index.module.scss"
import React, { useCallback, useEffect, useRef, useState } from "react"
import classNames from "classnames"
import {
  TASKS_STATUS_LABELS,
  TaskStatusEnum,
  TaskTypeEnum,
} from "@/types/enums"
import { tasksGetByIdEx, tasksUpdate } from "@/api/task"
import { TASK_INFO_ONLY_FIELDS_BASE } from "@/views/projects/experiments/columnsLib"
import { Task } from "@/types/task"
import { TaskIconLabel } from "@/components/TaskIconLabel"
import {
  Button,
  ConfigProvider,
  Input,
  message,
  notification,
  Popover,
  Space,
  Spin,
  Tabs,
  theme,
  Tooltip,
} from "antd"
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"
import { useOnClickOutside } from "@/hooks/useClickOutside"
import { Tag, TagList } from "@/components/TagList"
import { useMenuCtx } from "@/views/projects/experiments/menu/MenuCtx"
import copy from "copy-to-clipboard"
import { useStoreSelector } from "@/store"
import { cloneDeep } from "lodash"
import { DetailContext } from "@/views/projects/experiments/details/DetailContext"

const { defaultAlgorithm } = theme
export const ExperimentDetails = (props: {
  children: JSX.Element
  onTaskChange: (e: string, t?: Task[]) => void
}) => {
  const params = useParams()
  const navigate = useNavigate()
  const selectedTask = useStoreSelector((state) => state.task.selectedTask)
  const { children, onTaskChange } = props

  const [curTask, setCurTask] = useState<Task>()
  const [loading, setLoading] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showEditComment, setShowEditComment] = useState(false)
  const [newTaskName, setNewTaskName] = useState("")
  const [newComment, setNewComment] = useState("")
  const [activeTab, setActiveTab] = useState("execution")

  const [notify, notifyContext] = notification.useNotification()
  const [msg, msgContext] = message.useMessage()
  const menuCtx = useMenuCtx()
  const ref = useRef(null)

  useOnClickOutside(ref, () => {
    setShowEdit(false)
  })

  const getTaskInfo = useCallback(() => {
    setLoading(true)
    tasksGetByIdEx({
      id: [params["expId"] ?? ""],
      only_fields: TASK_INFO_ONLY_FIELDS_BASE,
    })
      .then(({ data }) => {
        if (data.tasks?.length) {
          setCurTask(data.tasks[0])
          setNewTaskName(data.tasks[0].name ?? "")
        } else {
          msg.warning("task not exits")
        }
      })
      .catch(() => {
        msg.error(`get task ${params["expId"]} failure`)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [params])

  useEffect(() => {
    if (
      params["expId"] ||
      (params["expId"] && selectedTask?.id === params["expId"])
    )
      getTaskInfo()
  }, [params, selectedTask])

  const content = (
    <div style={{ width: 200, fontSize: 12 }}>
      <div>{curTask?.comment}</div>
      <Button
        onClick={startEditComment}
        type="text"
        style={{ fontSize: 12, marginTop: 10 }}
        size="small"
      >
        Edit Description
      </Button>
    </div>
  )

  function updateTaskName() {
    if (!curTask) {
      return
    }
    tasksUpdate({
      task: curTask.id,
      name: newTaskName,
    }).then(({ data }) => {
      setCurTask({ ...curTask, ...data.fields })
      setShowEdit(false)
      onTaskChange("updateSelected", [{ ...curTask, ...data.fields }])
    })
  }

  function updateTaskTags(op: string, tag: Tag) {
    if (!curTask) {
      return
    }
    const oldTags = cloneDeep(curTask.tags ?? [])
    tasksUpdate({
      task: curTask.id,
      tags:
        op === "rm"
          ? [...oldTags.filter((t) => t !== tag.caption)]
          : [...oldTags, tag.caption],
    })
      .then(({ data }) => {
        setCurTask({ ...curTask, ...data.fields })
        onTaskChange("updateSelected", [{ ...curTask, ...data.fields }])
        notify.open({
          type: "success",
          duration: 3,
          message: "info",
          description: `“${tag.caption}” tag has been ${
            op === "rm" ? "removed from" : "added to"
          } “${curTask.name}” experiment`,
          btn: (
            <Button type="text" onClick={() => restoreTaskTag(oldTags)}>
              Undo
            </Button>
          ),
        })
      })
      .catch(() => {
        msg.error("tags update failure")
      })
  }

  function restoreTaskTag(tags: string[]) {
    if (!curTask) {
      return
    }
    tasksUpdate({
      task: curTask.id,
      tags: tags,
    })
      .then(({ data }) => {
        setCurTask({ ...curTask, ...data.fields })
        onTaskChange("updateSelected", [{ ...curTask, ...data.fields }])
      })
      .catch(() => {
        msg.error("tags update failure")
      })
  }

  function startEditComment() {
    setShowEditComment(true)
    setActiveTab("info")
    setNewComment(curTask?.comment ?? "")
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: defaultAlgorithm,
        components: {
          Layout: {
            colorBgHeader: "#ffffff",
          },
          Notification: {
            colorBgElevated: "#313852",
            colorText: "#ffffff",
            colorIcon: "#ffffff",
            colorTextHeading: "#ffffff",
          },
        },
        token: {
          colorBgBase: "#ffffff",
          colorBgContainer: "#ffffff",
          colorBgLayout: "#ffffff",
        },
      }}
    >
      {msgContext}
      {notifyContext}
      <div className={styles.experimentInfo}>
        <Spin
          spinning={loading}
          size={"large"}
          style={{ maxHeight: "100%" }}
          tip={"Loading..."}
        >
          {curTask && (
            <>
              <div
                className={classNames(
                  styles.statusLine,
                  styles[curTask.status ?? TaskStatusEnum.Unknown],
                )}
              >
                <span className={styles.labelWrap}>
                  <span className={styles.label}>
                    {
                      TASKS_STATUS_LABELS[
                        curTask.status ?? TaskStatusEnum.Unknown
                      ]
                    }
                  </span>
                </span>
              </div>
              <div className={styles.infoHeader}>
                <div className={styles.experimentName}>
                  <TaskIconLabel
                    className={styles.typeIcon}
                    type={curTask.type ?? TaskTypeEnum.Unknown}
                    showLabel={false}
                    iconClass={"l-40"}
                  />
                  {!showEdit ? (
                    <div
                      onClick={() => setShowEdit(true)}
                      className={styles.nameContent}
                    >
                      <span>{curTask.name}</span>
                    </div>
                  ) : (
                    <div className={styles.nameEditor} ref={ref}>
                      <Input
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                      />
                      <Button
                        type="text"
                        icon={<CheckOutlined />}
                        onClick={updateTaskName}
                      />
                      <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => {
                          setShowEdit(false)
                          setNewTaskName(curTask.name ?? "")
                        }}
                      />
                    </div>
                  )}
                </div>
                <Space size={20} style={{ marginLeft: "auto" }}>
                  <Tooltip
                    placement="bottom"
                    color="blue"
                    title={
                      <div style={{ fontSize: 12 }}>
                        Copy full ID ${curTask.id}
                      </div>
                    }
                  >
                    <div
                      className={styles.idNumber}
                      onClick={() => {
                        copy(curTask.id)
                        msg.success("id has been copied!")
                      }}
                    >
                      <div className="i-idCard"></div>
                      <span className={styles.hash}>
                        {curTask.id.slice(0, 8)}
                        <span>...</span>
                      </span>
                    </div>
                  </Tooltip>
                  <Popover
                    content={
                      curTask.comment ? (
                        content
                      ) : (
                        <Button
                          onClick={startEditComment}
                          type="text"
                          size="small"
                        >
                          Add Description
                        </Button>
                      )
                    }
                  >
                    <i
                      className={classNames(
                        "al-icon pointer sm-xd",
                        curTask.comment
                          ? "al-ico-task-desc"
                          : "al-ico-task-desc-outline",
                      )}
                    />
                  </Popover>
                  <Tooltip
                    color="blue"
                    placement="bottom"
                    title={
                      params["output"] ? "View in table" : "View full screen"
                    }
                  >
                    <i
                      className={classNames(
                        "al-icon pointer sm-xd",
                        params["output"]
                          ? "al-ico-info-min"
                          : "al-ico-info-max",
                      )}
                      onClick={() => {
                        params["output"]
                          ? navigate(
                              `/projects/${curTask.project?.id}/experiments/${curTask.id}/details`,
                            )
                          : navigate(
                              `/projects/${curTask.project?.id}/experiments/${curTask.id}/full/details`,
                            )
                      }}
                    />
                  </Tooltip>
                  <i
                    className="al-icon  sm-xd al-ico-bars-menu pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      menuCtx.setCtx({
                        ...menuCtx,
                        x: e.clientX,
                        y: e.clientY + 10,
                        target: curTask,
                        ctxMode: "single",
                        showMenu: true,
                      })
                    }}
                  />
                  {!params["output"] && (
                    <i
                      className="al-icon  sm-xd al-ico-dialog-x pointer"
                      onClick={() => {
                        navigate(`/projects/${curTask.project?.id}/experiments`)
                      }}
                    />
                  )}
                </Space>
              </div>
              <div className={styles.middleHeader}>
                <TagList
                  showAdd
                  showRemove
                  onUpdate={updateTaskTags}
                  sysTags={curTask.system_tags ?? []}
                  tags={curTask.tags ?? []}
                />
              </div>
              <Tabs
                activeKey={activeTab}
                onChange={(e) => setActiveTab(e)}
                centered
                items={[
                  { label: "EXECUTION", key: "execution" },
                  { label: "CONFIGURATION", key: "configuration" },
                  { label: "ARTIFACTS", key: "artifacts" },
                  { label: "INFO", key: "info" },
                  { label: "CONSOLE", key: "console" },
                  { label: "SCALARS", key: "scalars" },
                  { label: "PLOTS", key: "plots" },
                  { label: "DEBUG SAMPLES", key: "debug" },
                ]}
              />
            </>
          )}
          <DetailContext.Provider
            value={{ activeTab, current: curTask, setCurrent: setCurTask }}
          >
            {children}
          </DetailContext.Provider>
        </Spin>
      </div>
    </ConfigProvider>
  )
}
