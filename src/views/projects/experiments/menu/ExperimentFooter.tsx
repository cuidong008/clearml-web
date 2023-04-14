import styles from "./index.module.scss"
import { Button, Divider, Space } from "antd"
import { useMenuCtx } from "./MenuCtx"
import {
  selectionDisabledAbort,
  selectionDisabledAbortAllChildren,
  selectionDisabledArchive,
  selectionDisabledMoveTo,
  selectionDisabledPublishTasks,
  selectionDisabledReset,
  selectionDisabledTags,
} from "./items.utils"
import { AddTagPanel, Option } from "@/components/TagList/AddTagPanel"
import { useEffect, useState } from "react"
import { Tag } from "@/components/TagList"
import { tagColorManager } from "@/components/TagList/tagColors"

export const ExperimentFooter = () => {
  const ctx = useMenuCtx()
  const [tagPanelOpen, setTagPanelOpen] = useState(false)
  const [tagCanUse, setTagCanUse] = useState<Option[]>([])

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
    const tags = [...new Set(ctx.selectedTasks.map((t) => t.tags ?? []).flat())]
    setTagCanUse(
      tagColorManager.tags
        .filter((v) => !tags.includes(v))
        .map((v) => ({ label: v, value: v })),
    )
  }, [ctx.selectedTasks])

  function updateTags(op: string, t: Tag) {}

  return (
    <div className={styles.footer}>
      <Space size={12}>
        <a className={styles.selectToggle}>
          SHOW {`${ctx.selectedTasks.length}`} EXPERIMENTS SELECTED
        </a>
        <Button
          type="ghost"
          style={{ padding: 0, display: "flex", alignItems: "center" }}
          icon={<i className="al-icon al-ico-compare sm-md" />}
        >
          <span style={{ fontSize: 14, marginLeft: 5 }}>COMPARE</span>
        </Button>
        <Divider type="vertical" />
        {!ctx.isArchive && (
          <Button
            type="text"
            disabled={selectionDisabledArchive(ctx.selectedTasks).disable}
            icon={<i className="al-icon al-ico-archive sm-md" />}
          />
        )}
        {ctx.isArchive && (
          <>
            <Button
              type="text"
              disabled={selectionDisabledReset(ctx.selectedTasks).disable}
              icon={<i className="al-icon al-ico-restore sm-md" />}
            />
            <Button
              type="text"
              disabled={selectionDisabledReset(ctx.selectedTasks).disable}
              icon={<i className="al-icon al-ico-trash sm-md" />}
            />
          </>
        )}
        <Divider type="vertical" />
        <Button
          type="text"
          disabled={selectionDisabledReset(ctx.selectedTasks).disable}
          icon={<i className="al-icon al-ico-reset sm-md" />}
        />
        <Button
          type="text"
          disabled={selectionDisabledAbort(ctx.selectedTasks).disable}
          icon={<i className="al-icon al-ico-abort sm-md" />}
        />
        <Button
          type="text"
          disabled={
            selectionDisabledAbortAllChildren(ctx.selectedTasks).disable
          }
          icon={<i className="al-icon al-ico-abort-all sm-md" />}
        />
        <Button
          type="text"
          disabled={selectionDisabledPublishTasks(ctx.selectedTasks).disable}
          icon={<i className="al-icon al-ico-publish sm-md" />}
        />
        <Divider type="vertical" />
        <AddTagPanel
          show={tagPanelOpen}
          tags={[...new Set(ctx.selectedTasks.map((t) => t.tags ?? []).flat())]}
          tagCanUse={tagCanUse}
          setTagCanUse={setTagCanUse}
          updateTags={updateTags}
        >
          <Button
            type="text"
            className={styles.override}
            disabled={selectionDisabledTags(ctx.selectedTasks).disable}
            onMouseEnter={() => setTagPanelOpen(true)}
            icon={<i className="al-icon al-ico-tag sm-md" />}
          />
        </AddTagPanel>
        <Divider type="vertical" />
        <Button
          type="text"
          disabled={selectionDisabledMoveTo(ctx.selectedTasks).disable}
          icon={<i className="al-icon al-ico-move-to sm-md" />}
        />
      </Space>
    </div>
  )
}
