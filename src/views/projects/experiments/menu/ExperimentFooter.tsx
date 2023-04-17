import styles from "./index.module.scss"
import { Button, Divider, Space } from "antd"
import { useMenuCtx } from "./MenuCtx"
import {
  selectionDisabledAbort,
  selectionDisabledAbortAllChildren,
  selectionDisabledArchive,
  selectionDisabledDelete,
  selectionDisabledMoveTo,
  selectionDisabledPublishTasks,
  selectionDisabledReset,
  selectionDisabledTags,
} from "./items.utils"
import { AddTagPanel } from "@/components/TagList/AddTagPanel"
import { Tag } from "@/components/TagList"

export const ExperimentFooter = (props: {
  onItemClick: (e: string, from: string, data?: string) => void
}) => {
  const { onItemClick } = props
  const ctx = useMenuCtx()

  function onAddTag(t: Tag) {
    onItemClick("addTag", "footer", t.caption)
  }

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
            onClick={() => onItemClick("archive", "footer")}
          />
        )}
        {ctx.isArchive && (
          <>
            <Button
              type="text"
              disabled={selectionDisabledArchive(ctx.selectedTasks).disable}
              icon={<i className="al-icon al-ico-restore sm-md" />}
              onClick={() => onItemClick("archive", "footer")}
            />
            <Button
              type="text"
              disabled={selectionDisabledDelete(ctx.selectedTasks).disable}
              icon={<i className="al-icon al-ico-trash sm-md" />}
              onClick={() => onItemClick("delete", "footer")}
            />
          </>
        )}
        <Divider type="vertical" />
        <Button
          type="text"
          disabled={selectionDisabledReset(ctx.selectedTasks).disable}
          icon={<i className="al-icon al-ico-reset sm-md" />}
          onClick={() => onItemClick("reset", "footer")}
        />
        <Button
          type="text"
          disabled={selectionDisabledAbort(ctx.selectedTasks).disable}
          icon={<i className="al-icon al-ico-abort sm-md" />}
          onClick={() => onItemClick("abort", "footer")}
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
          trigger="click"
          tags={[...new Set(ctx.selectedTasks.map((t) => t.tags ?? []).flat())]}
          onAddTag={onAddTag}
          placement={"bottomLeft"}
        >
          <Button
            type="text"
            className={styles.override}
            disabled={selectionDisabledTags(ctx.selectedTasks).disable}
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
