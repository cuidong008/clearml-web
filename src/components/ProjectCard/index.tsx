import { Project } from "@/types/project";
import * as React from "react";
import { useState } from "react";
import classNames from "classnames";
import styles from "./index.module.scss";

import { Button, Input, Menu, Popover, Space, Tooltip } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteFilled,
  EditFilled,
  MenuOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { CircleCounter } from "@/components/CircleCounter";
import { CircleTypeEnum } from "@/types/enums";
import { DkCard } from "@/components/DkCard";

export const ProjectCard = (props: {
  project?: Project;
  showMenu?: boolean;
  showAdd?: boolean;
}) => {
  const { project, showMenu, showAdd } = props;
  const [showRename, setShowRename] = useState(false);
  const [open, setOpen] = useState(false);

  function startRename() {
    setOpen(false);
  }

  function startShare() {
    setOpen(false);
  }

  function startDelete() {
    setOpen(false);
  }

  function convertSecToDaysHrsMinsSec(secs: number) {
    const dayInSec = 60 * 60 * 24;
    const hourInSec = 60 * 60;
    const minInSec = 60;
    const d = Math.floor(secs / dayInSec);
    const h = Math.floor((secs - d * dayInSec) / hourInSec);
    const m = Math.floor((secs - (d * dayInSec + h * hourInSec)) / minInSec);
    const s = secs % 60;
    const H = h < 10 ? "0" + h : h;
    const M = m < 10 ? "0" + m : m;
    const S = s < 10 ? "0" + s : s;
    return `${
      d === 1 ? d + " DAY " : d > 1 ? d + " DAYS " : ""
    } ${H}:${M}:${S}`;
  }

  function shortProjectName(value: string): string {
    const shortName = value.substring(value.lastIndexOf("/") + 1);
    return `${
      (value.startsWith("[") && !shortName.startsWith("[") ? "[" : "") +
      shortName
    }`;
  }

  function subProjectNameTrans(value: string) {
    const count = (value.match(/\//g) || []).length;

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
      );
    }
    return (
      <div className={classNames(styles.subPath, styles.doubleWidth)}>
        {value}
      </div>
    );
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
                <Tooltip title={project.name} placement="bottom" color={"blue"}>
                  <span className={styles.projectName}>
                    {shortProjectName(project.name)}
                  </span>
                </Tooltip>
                {showRename && (
                  <Space>
                    <Input />
                    <Button type="text" icon={<CheckOutlined />} />
                    <Button type="text" icon={<CloseOutlined />} />
                  </Space>
                )}
                {showMenu && (
                  <Popover
                    open={open}
                    trigger={"click"}
                    placement={"bottomLeft"}
                    content={
                      <div onClick={(e) => e.stopPropagation()}>
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
                        color: "#fff",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpen(true);
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
                  project.stats?.active?.total_runtime ?? 0
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
  );
};
