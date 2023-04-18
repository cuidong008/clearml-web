import { TaskTypeEnumType } from "@/types/enums"
import classNames from "classnames"

export const TaskIconLabel = (props: {
  type: TaskTypeEnumType
  iconClass?: string
  showLabel?: boolean
  className?: string
}) => {
  const { type, iconClass, showLabel, className } = props
  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center" }}
    >
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
            : type?.replace(/[_-]/g, " ").toUpperCase()}
        </span>
      )}
    </div>
  )
}
