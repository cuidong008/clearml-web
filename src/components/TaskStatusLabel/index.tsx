import classNames from "classnames"
import {
  EXPERIMENTS_STATUS_LABELS,
  TaskStatusEnum,
  TaskStatusEnumType,
} from "@/types/enums"
import styles from "./index.module.scss"
import { Progress } from "antd"

export const TaskStatusLabel = (props: {
  status: TaskStatusEnumType
  showLabel?: boolean
  showIcon?: boolean
  progress?: string
  className?: string
}) => {
  const { status, showLabel, showIcon, progress, className } = props

  function showSpin() {
    return [TaskStatusEnum.InProgress].includes(status)
  }

  return (
    <div
      style={{ display: "flex", alignItems: "center" }}
      className={classNames(className, styles.taskStatusLabel, {
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
