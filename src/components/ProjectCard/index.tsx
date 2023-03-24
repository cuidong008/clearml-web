import { Project } from "@/types/project"
import * as React from "react"
import { useEffect, useState } from "react"
import classNames from "classnames"
import styles from "./index.module.scss"

import { Button, Input, Menu, Popover, Space, Tooltip } from "antd"
import {
  CheckOutlined,
  CloseOutlined,
  DeleteFilled,
  EditFilled,
  MenuOutlined,
  ShareAltOutlined,
} from "@ant-design/icons"
import { CircleCounter } from "@/components/CircleCounter"
import { CircleTypeEnum } from "@/types/enums"
import { DkCard } from "@/components/DkCard"

export const ProjectCard = (props: {
  project?: Project
  showMenu?: boolean
  showAdd?: boolean
  editProjId?: string
  dispatch?: (action: string, project?: Project, data?: string) => void
}) => {
  const { project, showMenu, showAdd, dispatch, editProjId } = props
  const [projectNewName, setProjectNewName] = useState("")
  const [showRename, setShowRename] = useState(false)

  useEffect(() => {
    if (project?.id !== editProjId && showRename) {
      setShowRename(() => false)
    }
  }, [editProjId, project, showRename])

  function startRename() {
    setProjectNewName(project?.name ?? "")
    setShowRename(true)
    dispatch?.("setEditProj", project)
  }

  function startShare() {
    dispatch?.("share", project)
  }

  function startDelete() {
    dispatch?.("delete", project)
  }

  function emitRename() {
    dispatch?.("rename", project, projectNewName)
    setShowRename(false)
  }

  function convertSecToDaysHrsMinsSec(secs: number) {
    const dayInSec = 60 * 60 * 24
    const hourInSec = 60 * 60
    const minInSec = 60
    const d = Math.floor(secs / dayInSec)
    const h = Math.floor((secs - d * dayInSec) / hourInSec)
    const m = Math.floor((secs - (d * dayInSec + h * hourInSec)) / minInSec)
    const s = secs % 60
    const H = h < 10 ? "0" + h : h
    const M = m < 10 ? "0" + m : m
    const S = s < 10 ? "0" + s : s
    return `${d === 1 ? d + " DAY " : d > 1 ? d + " DAYS " : ""} ${H}:${M}:${S}`
  }

  function shortProjectName(value: string): string {
    const shortName = value.substring(value.lastIndexOf("/") + 1)
    return `${
      (value.startsWith("[") && !shortName.startsWith("[") ? "[" : "") +
      shortName
    }`
  }

  function subProjectNameTrans(value: string) {
    const count = (value.match(/\//g) || []).length

    if (count > 1) {
      return (
        <>
          <div className={styles.subPath}>
            {value.substring(0, value.indexOf("/"))}
          </div>
          /
          <i className="al-ico-dots al-icon" />
          <div className={styles.subPath}>
            {value.substring(value.lastIndexOf("/"))}
          </div>
        </>
      )
    }
    return (
      <div className={classNames(styles.subPath, styles.doubleWidth)}>
        {value}
      </div>
    )
  }

  return (
    <div className={styles.projectCard}>
      <DkCard
        showFolder={true}
        oneTabMode={!project?.sub_projects?.length}
        showAdd={showAdd}
        cardHeader={
          <>
            {project && (
              <div className={styles.cardName}>
                {!showRename && (
                  <Tooltip
                    title={project.name}
                    placement="bottom"
                    color={"blue"}
                  >
                    <span className={styles.projectName}>
                      {shortProjectName(project.name)}
                    </span>
                  </Tooltip>
                )}
                {showRename && editProjId === project.id && (
                  <Space>
                    <Input
                      value={projectNewName}
                      onChange={(e) => setProjectNewName(e.target.value)}
                    />
                    <Button
                      type="text"
                      icon={<CheckOutlined />}
                      onClick={() => emitRename()}
                    />
                    <Button
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={() => setShowRename(false)}
                    />
                  </Space>
                )}
                {showMenu && (
                  <Popover
                    placement={"bottomLeft"}
                    destroyTooltipOnHide
                    content={
                      <div>
                        <Menu
                          items={[
                            {
                              key: "rename",
                              icon: <EditFilled />,
                              label: "Rename",
                              onClick: startRename,
                            },
                            {
                              key: "share",
                              icon: <ShareAltOutlined />,
                              label: "Share",
                              disabled: true,
                              onClick: startShare,
                            },
                            {
                              key: "delete",
                              icon: <DeleteFilled />,
                              label: "Delete",
                              onClick: startDelete,
                            },
                          ]}
                        />
                      </div>
                    }
                  >
                    <Button
                      type="text"
                      style={{
                        background: "none",
                        borderColor: "transparent",
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      icon={<MenuOutlined />}
                    />
                  </Popover>
                )}
              </div>
            )}
          </>
        }
        cardBody={
          <>
            {project && (
              <div className={styles.cardCounter}>
                <CircleCounter
                  counter={project.stats?.active?.total_tasks ?? "0"}
                  label={"TOTAL"}
                  type={
                    project.stats?.active?.total_tasks === 0
                      ? CircleTypeEnum.empty
                      : CircleTypeEnum.pending
                  }
                />
                <CircleCounter
                  counter={
                    project.stats?.active?.status_count?.in_progress ?? "0"
                  }
                  label={"RUNNING"}
                  type={
                    project.stats?.active?.status_count?.in_progress === 0
                      ? CircleTypeEnum.empty
                      : CircleTypeEnum.running
                  }
                />
                <CircleCounter
                  counter={project.stats?.active?.completed_tasks_24h ?? "0"}
                  label={"COMPLETED"}
                  underLabel="(24 hrs)"
                  type={
                    project.stats?.active?.completed_tasks_24h === 0
                      ? CircleTypeEnum.empty
                      : CircleTypeEnum.completed
                  }
                />
              </div>
            )}
          </>
        }
        cardFooter={
          <>
            {project?.stats && (
              <div className={styles.footerTitle}>
                COMPUTE TIME:{" "}
                {convertSecToDaysHrsMinsSec(
                  project.stats?.active?.total_runtime ?? 0,
                )}
              </div>
            )}
          </>
        }
        subFolderTitle={`${project?.sub_projects?.length} sub projects`}
        subCard={
          <div className={styles.subProjectsList}>
            {project?.sub_projects?.map((p) => (
              <a key={p.id} style={{ display: "flex", alignItems: "center" }}>
                <Tooltip title={p.name} placement="bottom" color={"blue"}>
                  {subProjectNameTrans(p.name)}
                </Tooltip>
              </a>
            ))}
          </div>
        }
      />
    </div>
  )
}
