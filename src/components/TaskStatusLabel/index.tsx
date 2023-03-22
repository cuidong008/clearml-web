import classNames from "classnames"
import { EXPERIMENTS_STATUS_LABELS } from "@/types/enums"
import styles from "./index.module.scss"

export const TaskStatusLabel = (props: {
  status: string
  showLabel?: boolean
  showIcon?: boolean
}) => {
  const { status, showLabel, showIcon } = props
  return (
    <div
      style={{ display: "flex", alignItems: "center", width: "100%" }}
      className={classNames(styles.taskStatusLabel, {
        [styles[status]]: showIcon,
      })}
    >
      {showIcon && <i className={classNames("icon xs", `i-${status}`)}></i>}
      {showLabel && (
        <div className={classNames("ellipsis", styles.label)}>
          {EXPERIMENTS_STATUS_LABELS[status] || status}
        </div>
      )}
    </div>
  )
}
