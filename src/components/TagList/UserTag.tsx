import { TagColor } from "@/types/common"
import styles from "./index.module.scss"
import classNames from "classnames"
import { Tag } from "./index"

export const UserTag = (props: {
  color: TagColor
  caption: string
  showAdd?: boolean
  showRemove?: boolean
  onRemove?: (tag: Tag) => void
}) => {
  const { color, caption, showAdd, showRemove, onRemove } = props
  return (
    <div
      className={classNames(styles.userTag, { [styles.addButton]: showAdd })}
    >
      <span
        className={classNames(styles.content, { [styles.addButton]: showAdd })}
        style={{
          backgroundColor: color.background,
          color: color.foreground,
        }}
      >
        {showAdd && <i className="al-icon al-ico-add xs" />}
        {caption}
      </span>
      {showRemove && (
        <i
          onClick={() => onRemove?.({ caption, color })}
          className={classNames("al-icon al-ico-dialog-x sm", styles.remove)}
          style={{ color: color.foreground }}
        />
      )}
      <div
        className={classNames(styles.arrow, { [styles.addButton]: showAdd })}
        style={{ backgroundColor: color.background }}
      />
    </div>
  )
}
