import { TaskTypeEnum } from "@/types/enums"
import classNames from "classnames"

export const TaskIconLabel = (props: {
  type: TaskTypeEnum
  iconClass?: string
  showLabel?: boolean
}) => {
  const { type, iconClass, showLabel } = props
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <i
        className={classNames(
          "al-icon",
          `${iconClass} al-ico-type-${
            type ? type.toString().replace("_", "-") : "training"
          }`,
        )}
      ></i>
      {showLabel && (
        <span className="ellipsis" style={{ marginLeft: "0.5rem" }}>
          {type?.length < 4
            ? type?.toUpperCase()
            : type.replace(/[_-]/g, " ").toUpperCase()}
        </span>
      )}
    </div>
  )
}
