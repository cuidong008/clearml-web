import { CSSProperties, useEffect, useRef, useState } from "react"
import { tagColorManager } from "./tagColors"
import { UserTag } from "./UserTag"
import styles from "./index.module.scss"
import { AddTagPanel, Option } from "./AddTagPanel"

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
  const [tagCanUse, setTagCanUse] = useState<Option[]>([])
  const [showAddPopup, setShowAddPopup] = useState(false)

  const ref = useRef(null)

  useEffect(() => {
    function closeOutClick() {
      console.log("close out tag")
      setShowAddPopup(false)
    }

    if (showAddPopup) {
      document.addEventListener("click", closeOutClick)
    }
    return () => {
      document.removeEventListener("click", closeOutClick)
    }
  }, [showAddPopup])

  useEffect(() => {
    const list = tags?.map((tag: string) => ({
      caption: tag,
      color: tagColorManager.getColor(tag),
    }))
    setTagsList(() => list)
    setTagCanUse(
      tagColorManager.tags
        .filter((v) => !tags.includes(v))
        .map((v) => ({ label: v, value: v })),
    )
  }, [tags])

  function updateTags(op: string, t: Tag) {
    onUpdate?.(op, t)
    setShowAddPopup(false)
    setTagCanUse([])
  }

  return (
    <div
      ref={ref}
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
          onRemove={(t) => updateTags("rm", t)}
          caption={t.caption}
          showRemove={showRemove}
        />
      ))}
      {showAdd && (
        <AddTagPanel
          show={showAddPopup}
          tags={tags}
          tagCanUse={tagCanUse}
          setTagCanUse={setTagCanUse}
          updateTags={updateTags}
        >
          <div
            onClick={(e) => {
              e.stopPropagation()
              setShowAddPopup(true)
            }}
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
