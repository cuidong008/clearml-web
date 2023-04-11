import styles from "./index.module.scss"
import { Task } from "@/types/task"
import {
  selectionDisabledAbort,
  selectionDisabledAbortAllChildren,
  selectionDisabledArchive,
  selectionDisabledDelete,
  selectionDisabledDequeue,
  selectionDisabledEnqueue,
  selectionDisabledMoveTo,
  selectionDisabledPublishTasks,
  selectionDisabledQueue,
  selectionDisabledReset,
  selectionDisabledTags,
  selectionDisabledViewWorker,
} from "./items.utils"
import classNames from "classnames"
import { useMenuCtx } from "../MenuCtx"
import { useParams } from "react-router-dom"

interface ContextMenuProps {
  onItemClick: (e: string, t: Task | undefined, data?: any) => void
}

interface CtxMenuItem {
  label: string
  show: boolean
  key: string
  disabled: () => boolean
  ico?: string
  onClick?: () => void
}

export const ContextMenu = (props: ContextMenuProps) => {
  const { onItemClick } = props
  const ctx = useMenuCtx()
  const params = useParams()

  function getCheckTasks() {
    return ctx.ctxMode === "multi"
      ? ctx.selectedTasks
      : ctx.target
      ? [ctx.target]
      : []
  }

  const menu: CtxMenuItem[][] = [
    [
      {
        label: "Detail",
        key: "detail",
        show: !params["expId"],
        disabled: () => false,
        ico: "al-ico-experiment-view",
        onClick: () => {
          onItemClick("detail", ctx.target)
        },
      },
      {
        label:
          params["output"] === "full" ? "View In Table" : "View Full Screen",
        key: "view",
        disabled: () => false,
        show: true,
        ico: "al-ico-info-max",
        onClick: () => {
          onItemClick(
            "view",
            ctx.target,
            params["output"] === "full" ? "table" : "full",
          )
        },
      },
    ],
    [
      {
        label: "Manage Queue",
        key: "mq",
        disabled: () =>
          !!ctx.target && selectionDisabledQueue([ctx.target]).disable,
        show: true,
        ico: "al-ico-manage-queue",
        onClick: () => {
          onItemClick("mq", ctx.target)
        },
      },
      {
        label: "View Worker",
        key: "viewWorker",
        disabled: () =>
          !!ctx.target && selectionDisabledViewWorker([ctx.target]).disable,
        show: true,
        ico: "al-ico-workers",
        onClick: () => {
          onItemClick("viewWorker", ctx.target)
        },
      },
    ],
    [
      {
        label: "Share",
        key: "share",
        disabled: () => ctx.isArchive,
        show: true,
        ico: "al-ico-shared-item",
        onClick: () => {
          onItemClick("share", ctx.target)
        },
      },
      {
        label: `Delete ${
          ctx.ctxMode === "multi"
            ? `( ${selectionDisabledDelete(getCheckTasks()).available} items )`
            : ""
        }`,
        key: "delete",
        disabled: () =>
          !!ctx.target && selectionDisabledDelete([ctx.target]).disable,
        show: ctx.isArchive,
        ico: "al-ico-trash",
        onClick: () => {
          onItemClick("delete", ctx.target)
        },
      },
      {
        label: `${ctx.isArchive ? "Restore from Archive" : "Archive"}${
          ctx.ctxMode === "multi"
            ? ` ( ${
                selectionDisabledArchive(getCheckTasks()).available
              } items )`
            : ""
        }`,
        key: "archive",
        disabled: () => selectionDisabledArchive(getCheckTasks()).disable,
        show: true,
        ico: ctx.isArchive ? "al-ico-restore" : "al-ico-archive",
        onClick: () => {
          onItemClick("archive", ctx.target)
        },
      },
      {
        label: "Enqueue",
        key: "enqueue",
        disabled: () =>
          !!ctx.target && selectionDisabledEnqueue([ctx.target]).disable,
        show:
          !!ctx.target &&
          !selectionDisabledEnqueue([ctx.target]).disable &&
          !ctx.isArchive,
        ico: "al-ico-enqueue",
        onClick: () => {},
      },
      {
        label: "Dequeue",
        key: "dequeue",
        disabled: () =>
          !!ctx.target && selectionDisabledDequeue([ctx.target]).disable,
        show:
          !!ctx.target &&
          !selectionDisabledDequeue([ctx.target]).disable &&
          !ctx.isArchive,
        ico: "al-ico-dequeue",
        onClick: () => {},
      },
      {
        label: "Reset",
        key: "reset",
        disabled: () =>
          !!ctx.target && selectionDisabledReset([ctx.target]).disable,
        show: true,
        ico: "al-ico-reset",
        onClick: () => {},
      },
      {
        label: "Abort",
        key: "abort",
        disabled: () =>
          !!ctx.target && selectionDisabledAbort([ctx.target]).disable,
        show: true,
        ico: "al-ico-abort",
        onClick: () => {},
      },
      {
        label: "Abort All Children",
        key: "abort-all",
        disabled: () => false,
        show:
          !!ctx.target &&
          !selectionDisabledAbortAllChildren([ctx.target]).disable,
        ico: "al-ico-abort-all",
        onClick: () => {},
      },
      {
        label: "Publish",
        key: "publish",
        disabled: () =>
          !!ctx.target && selectionDisabledPublishTasks([ctx.target]).disable,
        show: true,
        ico: "al-ico-publish",
        onClick: () => {},
      },
    ],
    [
      {
        label: "Add Tag",
        key: "add-tag",
        disabled: () =>
          !!ctx.target && selectionDisabledTags([ctx.target]).disable,
        show: true,
        ico: "al-ico-tag",
        onClick: () => {},
      },
    ],
    [
      {
        label: "Clone",
        key: "clone",
        disabled: () => !ctx.target,
        show: true,
        ico: "al-ico-clone",
        onClick: () => {},
      },
      {
        label: "Move to Project",
        key: "move-to",
        disabled: () =>
          !!ctx.target && selectionDisabledMoveTo([ctx.target]).disable,
        show: true,
        ico: "al-ico-move-to",
        onClick: () => {},
      },
    ],
  ]

  return (
    <div
      id="expCtxMenu"
      className={styles.taskContextMenu}
      style={{
        // auto adjust menu pos
        display: ctx.showMenu ? "block" : "none",
        top: window.innerHeight - ctx.y > 400 ? ctx.y : undefined,
        bottom:
          window.innerHeight - ctx.y < 400
            ? window.innerHeight - ctx.y
            : undefined,
        left: window.innerWidth - ctx.x > 200 ? ctx.x : undefined,
        right:
          window.innerWidth - ctx.x < 200
            ? window.innerWidth - ctx.x
            : undefined,
      }}
    >
      <ul>
        {menu.map((group, index) => (
          <div key={`group-${index}`}>
            {group.map((item) =>
              item.show ? (
                <li
                  onClick={item?.onClick}
                  key={item.key}
                  className={classNames(styles.ctxItem, {
                    [styles.disabled]: item.disabled(),
                  })}
                >
                  <i className={classNames("al-icon sm-md", item.ico)} />
                  {item.label}
                </li>
              ) : (
                <div style={{ display: "none" }} key={item.key}></div>
              ),
            )}
            {index < menu.length - 1 && <hr />}
          </div>
        ))}
      </ul>
    </div>
  )
}
