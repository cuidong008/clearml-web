import { CSSProperties, useEffect, useState } from "react"
import { tagColorManager } from "./tagColors"
import { UserTag } from "./UserTag"
import styles from "./index.module.scss"
import { AddTagPanel } from "./AddTagPanel"

export interface Tag {
  caption: string
  color: {
    background: string
    foreground: string
  }
}

const SYS_TAG_SHOW = ["shared"]
export const TagList = (props: {
  tags: string[]
  showAdd?: boolean
  showRemove?: boolean
  style?: CSSProperties
  sysTags?: string[]
  onUpdate?: (op: string, tag: Tag) => void
}) => {
  const { showAdd, showRemove, tags, style, sysTags, onUpdate } = props
  const [tagsList, setTagsList] = useState<Tag[]>([])
  const [showAddBtn, setShowAddBtn] = useState(false)

  useEffect(() => {
    const list = tags?.map((tag: string) => ({
      caption: tag,
      color: tagColorManager.getColor(tag),
    }))
    setTagsList(() => list)
  }, [tags])

  return (
    <div
      style={style}
      className={styles.tagList}
      onMouseEnter={() => setShowAddBtn(true)}
      onMouseLeave={() => setShowAddBtn(false)}
    >
      {sysTags
        ?.filter((t) => SYS_TAG_SHOW.includes(t))
        .map((t) => (
          <span key={`sys-${t}`} className={styles.sysTag}>
            {t}
          </span>
        ))}
      {tagsList.map((t) => (
        <UserTag
          key={`tag-${t.caption}`}
          color={t.color}
          onRemove={(t) => onUpdate?.("rm", t)}
          caption={t.caption}
          showRemove={showRemove}
        />
      ))}
      {showAdd && (
        <AddTagPanel
          trigger="click"
          tags={tags}
          onAddTag={(t) => onUpdate?.("add", t)}
          placement={"bottomLeft"}
        >
          <div
            style={{
              visibility:
                showAddBtn || tagsList.length === 0 ? "visible" : "hidden",
            }}
          >
            <UserTag
              showAdd
              color={{ foreground: "#a7b2d8", background: "" }}
              caption={"ADD TAG"}
            />
          </div>
        </AddTagPanel>
      )}
    </div>
  )
}
