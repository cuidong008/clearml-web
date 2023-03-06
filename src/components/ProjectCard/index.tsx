import { Project } from "@/types/project";
import { useState } from "react";
import classNames from "classnames";
import styles from "./index.module.scss";

import { Button, Input, Space, Tooltip } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

export const ProjectCard = (props: { project: Project }) => {
  const { project } = props;
  const [mainHovered, setMainHovered] = useState(false);
  const [secHovered, setSecHovered] = useState(false);
  const [showSec, setShowSec] = useState(false);
  const [showRename, setShowRename] = useState(false);

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
              {project.sub_projects?.length && secHovered && (
                <path
                  d="M30.06,0H64V20H30.06C29.93,19.78,30.06,11.93,30.06,0Z"
                  fill="#5a658e"
                />
              )}
              {project.sub_projects?.length && !secHovered && (
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
        {!!project.sub_projects?.length && (
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
                <Tooltip>
                  <span className={styles.projectName}>{project.name}</span>
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
          </div>
        ) : (
          <div className={styles.secondTabContainer}></div>
        )}
      </div>
    </div>
  );
};
