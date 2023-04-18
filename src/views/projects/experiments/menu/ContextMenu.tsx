import styles from "./index.module.scss"
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
import { useMenuCtx } from "./MenuCtx"
import { useParams } from "react-router-dom"
import { AddTagPanel } from "@/components/TagList/AddTagPanel"

interface CtxMenuItem {
  label: string
  show: boolean
  key: string
  disabled: () => boolean
  ico?: string
  onClick?: () => void
}

export const ContextMenu = (props: {
  onItemClick: (e: string, from: string, data?: string) => void
}) => {
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
          onItemClick("detail", "ctx")
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
            "ctx",
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
          onItemClick("mq", "ctx")
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
          onItemClick("viewWorker", "ctx")
        },
      },
    ],
    [
      {
        label: "Share",
        key: "share",
        disabled: () => ctx.isArchive,
        show: false,
        ico: "al-ico-shared-item",
        onClick: () => {
          onItemClick("share", "ctx")
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
          onItemClick("delete", "ctx")
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
          onItemClick("archive", "ctx")
        },
      },
      {
        label: `Enqueue ${
          ctx.ctxMode === "multi"
            ? `( ${selectionDisabledEnqueue(getCheckTasks()).available} items )`
            : ""
        }`,
        key: "enqueue",
        disabled: () =>
          !!ctx.target && selectionDisabledEnqueue([ctx.target]).disable,
        show: false, // not support temporary
        // !!ctx.target &&
        // !selectionDisabledEnqueue([ctx.target]).disable &&
        // !ctx.isArchive,
        ico: "al-ico-enqueue",
        onClick: () => {},
      },
      {
        label: `Dequeue ${
          ctx.ctxMode === "multi"
            ? `( ${selectionDisabledDequeue(getCheckTasks()).available} items )`
            : ""
        }`,
        key: "dequeue",
        disabled: () =>
          !!ctx.target && selectionDisabledDequeue([ctx.target]).disable,
        show: false, // not support temporary
        // !!ctx.target &&
        // !selectionDisabledDequeue([ctx.target]).disable &&
        // !ctx.isArchive,
        ico: "al-ico-dequeue",
        onClick: () => {},
      },
      {
        label: `Reset ${
          ctx.ctxMode === "multi"
            ? `( ${selectionDisabledReset(getCheckTasks()).available} items )`
            : ""
        }`,
        key: "reset",
        disabled: () =>
          !!ctx.target && selectionDisabledReset(getCheckTasks()).disable,
        show: true,
        ico: "al-ico-reset",
        onClick: () => {
          onItemClick("reset", "ctx")
        },
      },
      {
        label: `Abort ${
          ctx.ctxMode === "multi"
            ? `( ${selectionDisabledAbort(getCheckTasks()).available} items )`
            : ""
        }`,
        key: "abort",
        disabled: () =>
          !!ctx.target && selectionDisabledAbort(getCheckTasks()).disable,
        show: true,
        ico: "al-ico-abort",
        onClick: () => {
          onItemClick("abort", "ctx")
        },
      },
      {
        label: "Abort All Children",
        key: "abort-all",
        disabled: () => false,
        show:
          !!ctx.target &&
          !selectionDisabledAbortAllChildren(getCheckTasks()).disable,
        ico: "al-ico-abort-all",
        onClick: () => {
          onItemClick("abortAll", "ctx")
        },
      },
      {
        label: `Publish ${
          ctx.ctxMode === "multi"
            ? `( ${
                selectionDisabledPublishTasks(getCheckTasks()).available
              } items )`
            : ""
        }`,
        key: "publish",
        disabled: () =>
          !!ctx.target &&
          selectionDisabledPublishTasks(getCheckTasks()).disable,
        show: true,
        ico: "al-ico-publish",
        onClick: () => {
          onItemClick("publish", "ctx")
        },
      },
    ],
    [
      {
        label: `Add Tag ${
          ctx.ctxMode === "multi"
            ? `( ${selectionDisabledTags(getCheckTasks()).available} items )`
            : ""
        }`,
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
        onClick: () => {
          onItemClick("clone", "ctx")
        },
      },
      {
        label: `Move to Project ${
          ctx.ctxMode === "multi"
            ? `( ${selectionDisabledMoveTo(getCheckTasks()).available} items )`
            : ""
        }`,
        key: "move-to",
        disabled: () =>
          !!ctx.target && selectionDisabledMoveTo([ctx.target]).disable,
        show: true,
        ico: "al-ico-move-to",
        onClick: () => {
          onItemClick("move", "ctx")
        },
      },
    ],
  ]

  function generateMenuItem(item: CtxMenuItem) {
    return (
      <li
        style={{ display: item.show ? "block" : "none" }}
        onClick={item?.onClick}
        key={item.key}
        className={classNames(styles.ctxItem, {
          [styles.disabled]: item.disabled(),
        })}
      >
        <i className={classNames("al-icon sm-md", item.ico)} />
        {item.label}
      </li>
    )
  }

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
              item.key === "add-tag" ? (
                <AddTagPanel
                  key={item.key}
                  trigger="hover"
                  onAddTag={(e) => onItemClick("addTag", "ctx", e.caption)}
                  placement={"rightTop"}
                  tags={
                    ctx.ctxMode === "multi"
                      ? ctx.selectedTasks.map((t) => t.tags ?? []).flat()
                      : ctx.target?.tags ?? []
                  }
                >
                  {generateMenuItem(item)}
                </AddTagPanel>
              ) : (
                generateMenuItem(item)
              ),
            )}
            {index < menu.length - 1 && <hr />}
          </div>
        ))}
      </ul>
    </div>
  )
}
