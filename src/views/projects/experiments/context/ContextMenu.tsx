import styles from "./index.module.scss"
import { Task } from "@/types/task"
import {
  selectionDisabledQueue,
  selectionDisabledViewWorker,
} from "@/views/projects/experiments/context/items.utils"
import classNames from "classnames"

export interface MenuCtx {
  x: number
  y: number
  show: boolean
  task: Task | undefined
}

export interface ContextMenuProps {
  ctx: MenuCtx
  isArchive: boolean
  multiSelect: boolean
  viewState: string
  dispatch: (e: string, t: Task | undefined) => void
}

export interface CtxMenuItem {
  label: string
  show: boolean
  key: string
  disabled: () => boolean
  ico?: string
  onClick?: () => void
}

export const ContextMenu = (props: ContextMenuProps) => {
  const { ctx, isArchive, multiSelect, viewState, dispatch } = props
  const menu: CtxMenuItem[][] = [
    [
      {
        label: "Detail",
        key: "detail",
        show: viewState === "table",
        disabled: () => false,
        ico: "al-ico-experiment-view",
        onClick: () => {
          dispatch("detail", ctx.task)
        },
      },
      {
        label: viewState === "full" ? "View In Table" : "View Full Screen",
        key: "view",
        disabled: () => false,
        show: true,
        ico: "al-ico-info-max",
        onClick: () => {
          dispatch("view", ctx.task)
        },
      },
    ],
    [
      {
        label: "Manage Queue",
        key: "mq",
        disabled: () =>
          !!ctx.task && selectionDisabledQueue([ctx.task]).disable,
        show: true,
        ico: "al-ico-manage-queue",
        onClick: () => {
          dispatch("mq", ctx.task)
        },
      },
      {
        label: "View Worker",
        key: "viewWorker",
        disabled: () =>
          !!ctx.task && selectionDisabledViewWorker([ctx.task]).disable,
        show: true,
        ico: "al-ico-workers",
        onClick: () => {
          dispatch("viewWorker", ctx.task)
        },
      },
    ],
  ]

  return (
    <div
      id="expCtxMenu"
      className={styles.taskContextMenu}
      style={{
        // auto adjust menu pos
        display: ctx.show ? "block" : "none",
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
        {menu.map((g, i) => (
          <div key={`g-${i}`}>
            {g.map((item) =>
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
            {i < menu.length - 1 && <hr />}
          </div>
        ))}
      </ul>
    </div>
  )
}
