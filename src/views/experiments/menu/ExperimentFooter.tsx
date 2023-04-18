import styles from "./index.module.scss"
import { Button, Divider, Space, Tooltip } from "antd"
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
          <Tooltip
            color="blue"
            title={`Archive ( ${
              selectionDisabledArchive(ctx.selectedTasks).available
            } items )`}
          >
            <Button
              type="text"
              disabled={selectionDisabledArchive(ctx.selectedTasks).disable}
              icon={<i className="al-icon al-ico-archive sm-md" />}
              onClick={() => onItemClick("archive", "footer")}
            />
          </Tooltip>
        )}
        {ctx.isArchive && (
          <>
            <Tooltip
              color="blue"
              title={`Restore from Archive ( ${
                selectionDisabledArchive(ctx.selectedTasks).available
              } items )`}
            >
              <Button
                type="text"
                disabled={selectionDisabledArchive(ctx.selectedTasks).disable}
                icon={<i className="al-icon al-ico-restore sm-md" />}
                onClick={() => onItemClick("archive", "footer")}
              />
            </Tooltip>
            <Tooltip
              color="blue"
              title={`Delete ( ${
                selectionDisabledDelete(ctx.selectedTasks).available
              } items )`}
            >
              <Button
                type="text"
                disabled={selectionDisabledDelete(ctx.selectedTasks).disable}
                icon={<i className="al-icon al-ico-trash sm-md" />}
                onClick={() => onItemClick("delete", "footer")}
              />
            </Tooltip>
          </>
        )}
        <Divider type="vertical" />
        <Tooltip
          color="blue"
          title={`Reset ( ${
            selectionDisabledReset(ctx.selectedTasks).available
          } items )`}
        >
          <Button
            type="text"
            disabled={selectionDisabledReset(ctx.selectedTasks).disable}
            icon={<i className="al-icon al-ico-reset sm-md" />}
            onClick={() => onItemClick("reset", "footer")}
          />
        </Tooltip>
        <Tooltip
          color="blue"
          title={`Abort ( ${
            selectionDisabledAbort(ctx.selectedTasks).available
          } items )`}
        >
          <Button
            type="text"
            disabled={selectionDisabledAbort(ctx.selectedTasks).disable}
            icon={<i className="al-icon al-ico-abort sm-md" />}
            onClick={() => onItemClick("abort", "footer")}
          />
        </Tooltip>
        <Tooltip color="blue" title="Abort all children">
          <Button
            type="text"
            disabled={
              selectionDisabledAbortAllChildren(ctx.selectedTasks).disable
            }
            icon={<i className="al-icon al-ico-abort-all sm-md" />}
            onClick={() => onItemClick("abortAll", "footer")}
          />
        </Tooltip>
        <Tooltip
          color="blue"
          title={`Publish ( ${
            selectionDisabledPublishTasks(ctx.selectedTasks).available
          } items )`}
        >
          <Button
            type="text"
            disabled={selectionDisabledPublishTasks(ctx.selectedTasks).disable}
            icon={<i className="al-icon al-ico-publish sm-md" />}
            onClick={() => onItemClick("publish", "footer")}
          />
        </Tooltip>
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
        <Tooltip
          color="blue"
          title={`Move to Project ( ${
            selectionDisabledMoveTo(ctx.selectedTasks).available
          } items )`}
        >
          <Button
            type="text"
            disabled={selectionDisabledMoveTo(ctx.selectedTasks).disable}
            icon={<i className="al-icon al-ico-move-to sm-md" />}
            onClick={() => onItemClick("move", "footer")}
          />
        </Tooltip>
      </Space>
    </div>
  )
}
