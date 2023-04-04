import classNames from "classnames"
import { EXPERIMENTS_STATUS_LABELS, TaskStatusEnum } from "@/types/enums"
import styles from "./index.module.scss"
import { Progress } from "antd"

export const TaskStatusLabel = (props: {
  status: string
  showLabel?: boolean
  showIcon?: boolean
  progress?: string
}) => {
  const { status, showLabel, showIcon, progress } = props

  function showSpin() {
    return [TaskStatusEnum.InProgress].includes(status)
  }

  return (
    <div
      style={{ display: "flex", alignItems: "center", width: "100%" }}
      className={classNames(styles.taskStatusLabel, {
        [styles[status]]: showIcon,
      })}
    >
      {showIcon && <i className={classNames("icon xs", `i-${status}`)}></i>}
      {showLabel && (
        <div
          className={classNames("ellipsis", styles.label, {
            "with-spinner": showSpin() && progress,
          })}
        >
          {EXPERIMENTS_STATUS_LABELS[status] || status}
        </div>
      )}
      {showSpin() && progress && (
        <Progress
          type="circle"
          className={styles.spinner}
          percent={parseFloat(progress)}
          size={18}
        />
      )}
    </div>
  )
}
