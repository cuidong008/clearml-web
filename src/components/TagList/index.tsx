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

const SYS_TAG_SHOW = ["shared"]
export const TagList = (props: {
  tags: string[]
  style?: CSSProperties
  sysTags?: string[]
}) => {
  const { tags, style, sysTags } = props
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
      {sysTags
        ?.filter((t) => SYS_TAG_SHOW.includes(t))
        .map((t) => (
          <span key={`sys-${t}`} className={styles.sysTag}>
            {t}
          </span>
        ))}
      {tagsList.map((t) => (
        <UserTag key={`tag-${t.caption}`} color={t.color} caption={t.caption} />
      ))}
    </div>
  )
}
