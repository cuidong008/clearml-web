import { ConfigProvider, Input, Popover, theme } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import "./dialog.scss"
import { tagColorManager } from "./tagColors"
import { MouseEvent, ReactNode, useEffect, useState } from "react"
import { Tag } from "@/components/TagList/index"
import { useMenuCtx } from "@/views/experiments/menu/MenuCtx"
import { TooltipPlacement } from "antd/es/tooltip"

const { defaultAlgorithm } = theme

interface Option {
  label: ReactNode
  value: string
}

export const AddTagPanel = (props: {
  children: JSX.Element
  tags: string[]
  trigger: "click" | "hover"
  placement: TooltipPlacement
  onAddTag: (tag: Tag) => void
}) => {
  const ctx = useMenuCtx()
  const { children, trigger, tags, placement, onAddTag } = props
  const [tagSearch, setTagSearch] = useState("")
  const [tagPanelOpen, setTagPanelOpen] = useState(false)
  const [tagCanUse, setTagCanUse] = useState<Option[]>([])

  useEffect(() => {
    const tags = [...new Set(ctx.selectedTasks.map((t) => t.tags ?? []).flat())]
    setTagCanUse(
      tagColorManager.tags
        .filter((v) => !tags.includes(v))
        .map((v) => ({ label: v, value: v })),
    )
  }, [ctx.selectedTasks])

  useEffect(() => {
    function closeOutClick() {
      console.log("close out tag")
      setTagPanelOpen(false)
    }

    if (tagPanelOpen) {
      document.addEventListener("click", closeOutClick)
    }
    return () => {
      document.removeEventListener("click", closeOutClick)
    }
  }, [tagPanelOpen])

  useEffect(() => {
    if (tagPanelOpen) {
      filterTags("")
    } else {
      setTagSearch("")
      setTagCanUse([])
    }
  }, [tagPanelOpen])

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

  const event = {
    ...(trigger === "click" && {
      onClick: (e: MouseEvent) => {
        e.stopPropagation()
        setTagPanelOpen(true)
      },
    }),
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
        placement={placement}
        trigger={trigger}
        {...(trigger === "click"
          ? { open: tagPanelOpen }
          : {
              onOpenChange: (e) => setTagPanelOpen(e),
            })}
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
                  onClick={() => {
                    onAddTag({
                      caption: v.value,
                      color: tagColorManager.getColor(v.value),
                    })
                    setTagPanelOpen(false)
                  }}
                >
                  {v.label}
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <div {...event}>{children}</div>
      </Popover>
    </ConfigProvider>
  )
}
