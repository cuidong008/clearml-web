import { TagColor } from "@/types/common"
import styles from "./index.module.scss"
import classNames from "classnames"

export const UserTag = (props: {
  color: TagColor
  caption: string
  showAdd?: boolean
  showRemove?: boolean
}) => {
  const { color, caption, showAdd, showRemove } = props
  return (
    <div className={styles.userTag}>
      <span
        className={styles.content}
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
          className={classNames("al-icon al-ico-dialog-x sm", styles.remove)}
          style={{ color: color.foreground }}
        />
      )}
      <div
        className={classNames(styles.arrow, { [styles.addButton]: showAdd })}
        style={{ backgroundColor: color.background }}
      ></div>
    </div>
  )
}
