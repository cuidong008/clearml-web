import { CSSProperties, useEffect, useState } from "react"
import { tagColorManager } from "@/components/TagList/tagColors"
import { UserTag } from "@/components/TagList/UserTag"
import styles from "./index.module.scss"

export interface Tag {
  caption: string
  color: {
    background: string
    foreground: string
  }
}

const SYS_TAG = ["shared"]
export const TagList = (props: { tags: string[]; style?: CSSProperties }) => {
  const { tags, style } = props
  const [tagsList, setTagsList] = useState<Tag[]>([])

  useEffect(() => {
    const list = tags?.map((tag: string) => ({
      caption: tag,
      color: tagColorManager.getColor(tag),
    }))
    setTagsList(() => list)
  }, [tags])

  return (
    <div style={style} className={styles.tagList}>
      {tagsList.map((t) =>
        SYS_TAG.includes(t.caption) ? (
          <span key={`sys-${t.caption}`} className={styles.sysTag}>
            {t.caption}
          </span>
        ) : (
          <UserTag
            key={`tag-${t.caption}`}
            color={t.color}
            caption={t.caption}
          />
        ),
      )}
    </div>
  )
}
