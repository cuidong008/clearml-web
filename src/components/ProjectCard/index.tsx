import { Project } from "@/types/project";
import { useState } from "react";
import classNames from "classnames";
import styles from "./index.module.scss";

import { Button, Input, Space, Tooltip } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { CircleCounter } from "@/components/CircleCounter";
import { CircleTypeEnum } from "@/types/enums";

export const ProjectCard = (props: {
  project?: Project;
  showMenu?: boolean;
  showAdd?: boolean;
}) => {
  const { project, showMenu, showAdd } = props;
  const [mainHovered, setMainHovered] = useState(false);
  const [secHovered, setSecHovered] = useState(false);
  const [showSec, setShowSec] = useState(false);
  const [showRename, setShowRename] = useState(false);

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
      <div className={styles.folderTab}>
        <div className={styles.firstTab} onClick={() => setShowSec(false)}>
          {!showSec ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="20"
              viewBox="0 0 64 20"
            >
              {project?.sub_projects?.length && secHovered && (
                <path
                  d="M30.06,0H64V20H30.06C29.93,19.78,30.06,11.93,30.06,0Z"
                  fill="#5a658e"
                />
              )}
              {project?.sub_projects?.length && !secHovered && (
                <path
                  d="M30.06,0H64V20H30.06C29.93,19.78,30.06,11.93,30.06,0Z"
                  fill="#2c3246"
                />
              )}
              {mainHovered ? (
                <path
                  d="M35.61,0H6A6,6,0,0,0,0,6V20H60C44.82,12.36,49.37,0,35.61,0Z"
                  fill="#5a658e"
                  onMouseEnter={() => setMainHovered(true)}
                  onMouseLeave={() => setMainHovered(false)}
                />
              ) : (
                <path
                  d="M35.61,0H6A6,6,0,0,0,0,6V20H60C44.82,12.36,49.37,0,35.61,0Z"
                  fill="#384161"
                  onMouseEnter={() => setMainHovered(true)}
                  onMouseLeave={() => setMainHovered(false)}
                />
              )}
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="20"
              viewBox="0 0 64 20"
            >
              {mainHovered ? (
                <path
                  d="M35.61,0H6A6,6,0,0,0,0,6V20H60C44.82,12.36,49.37,0,35.61,0Z"
                  fill="#5a658e"
                  onMouseEnter={() => setMainHovered(true)}
                  onMouseLeave={() => setMainHovered(false)}
                />
              ) : (
                <path
                  d="M35.61,0H6A6,6,0,0,0,0,6V20H60C44.82,12.36,49.37,0,35.61,0Z"
                  fill="#384161"
                  onMouseEnter={() => setMainHovered(true)}
                  onMouseLeave={() => setMainHovered(false)}
                />
              )}
              <path
                d="M64,0V20H30C45.18,12.36,40.63,0,54.39,0Z"
                fill="#2c3246"
              />
            </svg>
          )}
        </div>
        {!!project?.sub_projects?.length && (
          <>
            <div
              className={classNames(styles.middleTab, {
                [styles.tabHovered]: secHovered,
                [styles.showSecTab]: showSec,
                [styles.secTabActive]: showSec,
              })}
              onClick={() => setShowSec(true)}
              onMouseEnter={() => setSecHovered(true)}
              onMouseLeave={() => setSecHovered(false)}
            >
              {`${project?.sub_projects?.length} sub projects`}
            </div>
            <div
              className={classNames(styles.secondTab, {
                [styles.tabHovered]: secHovered,
                [styles.showSecTab]: showSec,
              })}
              onClick={() => setShowSec(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="20"
                viewBox="0 0 28 20"
              >
                {(showSec || !secHovered) && (
                  <path
                    d="M3.61,0C17.37,0,12.82,12.36,28,20H0V0Z"
                    fill="#2c3246"
                  />
                )}
                {!showSec && secHovered && (
                  <path
                    d="M3.61,0C17.37,0,12.82,12.36,28,20H0V0Z"
                    fill="#5a658e"
                  />
                )}
              </svg>
            </div>
          </>
        )}
      </div>
      <div className={styles.cardContainer}>
        {project && (
          <>
            {!showSec ? (
              <div
                className={classNames(styles.firstTabContainer, {
                  [styles.firstTabHover]: mainHovered,
                })}
                onMouseEnter={() => setMainHovered(true)}
                onMouseLeave={() => setMainHovered(false)}
              >
                <header>
                  <div className={styles.cardName}>
                    <Tooltip
                      title={project.name}
                      placement="bottom"
                      color={"blue"}
                    >
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
                  </div>
                </header>
                <div className={styles.line}></div>
                <div className={styles.cardBody}>
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
                      counter={
                        project.stats?.active?.completed_tasks_24h ?? "0"
                      }
                      label={"COMPLETED"}
                      underLabel="(24 hrs)"
                      type={
                        project.stats?.active?.completed_tasks_24h === 0
                          ? CircleTypeEnum.empty
                          : CircleTypeEnum.completed
                      }
                    />
                  </div>
                </div>
                <footer>
                  {project?.stats && (
                    <div className={styles.footerTitle}>
                      COMPUTE TIME:{" "}
                      {convertSecToDaysHrsMinsSec(
                        project.stats?.active?.total_runtime ?? 0
                      )}
                    </div>
                  )}
                </footer>
              </div>
            ) : (
              <div className={styles.secondTabContainer}>
                <div className={styles.subProjectsList}>
                  {project?.sub_projects?.map((p) => (
                    <a
                      key={p.id}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Tooltip title={p.name} placement="bottom" color={"blue"}>
                        {subProjectNameTrans(p.name)}
                      </Tooltip>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {showAdd && (
          <div
            className={classNames(styles.plusCard, {
              [styles.plusCardHover]: mainHovered,
            })}
            onMouseEnter={() => setMainHovered(true)}
            onMouseLeave={() => setMainHovered(false)}
          >
            <div
              className={classNames(
                "al-icon al-ico-plus al-color",
                styles.plusIcon
              )}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};
