import { ConfigProvider, Input, Popover, theme } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import "./dialog.scss"
import { tagColorManager } from "@/components/TagList/tagColors"
import { ReactNode, useEffect, useState } from "react"
import { Tag } from "@/components/TagList/index"

const { defaultAlgorithm } = theme

export interface Option {
  label: ReactNode
  value: string
}

export const AddTagPanel = (props: {
  children: JSX.Element
  show: boolean
  tags: string[]
  tagCanUse: Option[]
  setTagCanUse: (e: Option[]) => void
  updateTags: (op: string, tag: Tag) => void
}) => {
  const { children, show, tags, tagCanUse, setTagCanUse, updateTags } = props
  const [tagSearch, setTagSearch] = useState("")

  useEffect(() => {
    if (!show) {
      setTagSearch("")
      setTagCanUse([])
    } else {
      filterTags("")
    }
  }, [show])

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
    if (filteredTags.length === 0 && !tags.some((v) => v === e)) {
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
    <ConfigProvider
      theme={{
        algorithm: defaultAlgorithm,
        components: {
          Popover: { colorText: "#222222" },
        },
        token: {
          colorBgBase: "#ffffff",
          colorBgContainer: "#ffffff",
          colorBgLayout: "#ffffff",
        },
      }}
    >
      <Popover
        overlayClassName="addTagDialog"
        autoAdjustOverflow
        arrow={false}
        placement="bottomLeft"
        open={show}
        content={
          <div onClick={(e) => e.stopPropagation()}>
            <Input
              placeholder={"Add Tag"}
              value={tagSearch}
              onChange={(e) => filterTags(e.target.value)}
              onInput={(e) => filterTags((e.target as HTMLInputElement).value)}
              addonAfter={<SearchOutlined />}
              bordered={false}
              allowClear
            />
            <ul className="tagOption">
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
        {children}
      </Popover>
    </ConfigProvider>
  )
}
