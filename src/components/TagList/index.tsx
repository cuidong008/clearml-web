import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react"
import { tagColorManager } from "@/components/TagList/tagColors"
import { UserTag } from "@/components/TagList/UserTag"
import styles from "./index.module.scss"
import { Input, Popover } from "antd"
import { SearchOutlined } from "@ant-design/icons"

export interface Tag {
  caption: string
  color: {
    background: string
    foreground: string
  }
}

interface Option {
  label: ReactNode
  value: string
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
  const [tagSearch, setTagSearch] = useState("")
  const [tagCanUse, setTagCanUse] = useState<Option[]>([])
  const [showAddPopup, setShowAddPopup] = useState(false)

  const ref = useRef(null)

  useEffect(() => {
    function closeOutClick() {
      console.log("close out tag")
      setShowAddPopup(false)
      setTagSearch("")
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
    setTagSearch("")
    setShowAddPopup(false)
    setTagCanUse([])
  }

  function filterTags(e: string) {
    setTagSearch(e)
    if (!e) {
      setTagCanUse(
        tagColorManager.tags
          .filter((v) => !tags.includes(v))
          .map((v) => ({ label: v, value: v })),
      )
      return
    }
    const filteredTags = tagCanUse.filter((t) => t.value.includes(e))
    if (filteredTags.length === 0 && !tagsList.some((v) => v.caption === e)) {
      filteredTags.push({
        label: (
          <>
            {e}
            <span style={{ color: "blue" }}> (Create New)</span>
          </>
        ),
        value: e,
      })
    }
    setTagCanUse(filteredTags)
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
        <Popover
          overlayClassName={styles.addTagDialog}
          autoAdjustOverflow
          arrow={false}
          placement="bottomLeft"
          open={showAddPopup}
          content={
            <div onClick={(e) => e.stopPropagation()}>
              <Input
                placeholder={"Add Tag"}
                value={tagSearch}
                onChange={(e) => filterTags(e.target.value)}
                onInput={(e) =>
                  filterTags((e.target as HTMLInputElement).value)
                }
                addonAfter={<SearchOutlined />}
                bordered={false}
                allowClear
              />
              <ul className={styles.tagOption}>
                {tagCanUse.map((v) => (
                  <li
                    key={v.value}
                    onClick={() =>
                      updateTags("add", {
                        caption: v.value,
                        color: tagColorManager.getColor(v.value),
                      })
                    }
                  >
                    {v.label}
                  </li>
                ))}
              </ul>
            </div>
          }
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
        </Popover>
      )}
    </div>
  )
}
