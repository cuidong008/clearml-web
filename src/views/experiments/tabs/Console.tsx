import { useCallback, useEffect, useRef, useState } from "react"
import { EventLog } from "@/types/event"
import { eventsGetTaskLog, getLog } from "@/api/event"
import { useDetailCtx } from "@/views/experiments/details/DetailContext"
import { Direction } from "@/types/enums"
import { useStoreSelector } from "@/store"
import styles from "./console.module.scss"
import { Button, Input, Space } from "antd"
import { DownloadOutlined, SyncOutlined } from "@ant-design/icons"
import { ansiConvert, hasAnsi } from "@/utils/transformer"
import classNames from "classnames"
import dayjs from "dayjs"
import { debounce } from "lodash"
import { AUTO_REFRESH_INTERVAL } from "@/utils/constant"

interface LogRow {
  timestamp?: number
  entry: string
  separator?: boolean
  hasAnsi?: boolean
}

export const Console = () => {
  const ctx = useDetailCtx()
  const autoRefresh = useStoreSelector(
    (state) => state.app.preferences.views?.autoRefresh,
  )
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<EventLog[]>([])
  const [lines, setLines] = useState<LogRow[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [filter, setFilter] = useState("")
  const [regex, setRegex] = useState<RegExp>()

  const ref = useRef<HTMLDivElement>(null)
  const refChild = useRef<HTMLDivElement>(null)
  // const scrollToBottom = useCallback(() => {
  //     setTimeout(() => {
  //       if (refChild.current && ref.current && refChild.current.clientHeight > ref.current.clientHeight && ref.current.scrollTop === 0) {
  //         const l = refChild.current.clientHeight - ref.current.clientHeight
  //         console.log(refChild.current.clientHeight, l)
  //         ref.current?.scrollTo({ top: l })
  //       }
  //     }, 200)
  //   },
  //   [],
  // );

  function downloadLog() {
    getLog(ctx.current?.id ?? "").then((e) => {
      console.log(e)
    })
  }

  const getLogs = useCallback(
    (reload: boolean, direction: Direction, from?: number) => {
      setLoading(true)
      eventsGetTaskLog({
        task: ctx.current?.id ?? "",
        batch_size: 100,
        navigate_earlier: direction !== "next",
        ...(!reload && { from_timestamp: from ?? null }),
      })
        .then(({ data }) => {
          console.log(data.events)
          if (reload) {
            setLogs(() => data.events ?? [])
          } else {
            direction === "next"
              ? setLogs(() => [...data.events, ...logs])
              : setLogs(() => [...logs, ...data.events])
          }
          setHasMore(logs.length < data.total)
          if (reload) {
            // scrollToBottom()
          }
        })
        .finally(() => setLoading(false))
    },
    [logs, ctx.current],
  )

  useEffect(() => {
    if (ctx.current) {
      getLogs(true, "prev")
    }
  }, [ctx.current])

  useEffect(() => {
    let clearTimer: NodeJS.Timer | null = null
    if (autoRefresh) {
      clearTimer = setInterval(() => {
        if (logs.length) {
          getLogs(false, "next", logs[0].timestamp)
        }
      }, AUTO_REFRESH_INTERVAL)
    }
    return () => {
      if (clearTimer) {
        clearInterval(clearTimer)
      }
    }
  }, [logs, autoRefresh])

  useEffect(() => {
    const logLines: LogRow[] = []
    logs
      .filter((row) => !filter || regex?.test(row?.msg ?? ""))
      .reverse()
      .forEach((logItem) => {
        let first = true
        if (!logItem.msg) {
          logLines.push({
            timestamp: logItem["timestamp"] || Number(logItem["@timestamp"]),
            entry: "",
            hasAnsi: false,
            separator: true,
          })
          return
        }
        logItem.msg
          .split("\n")
          .filter((msg) => !!msg)
          .forEach((msg: string) => {
            const msgHasAnsi = hasAnsi(msg)
            const converted = msg
              ? msgHasAnsi
                ? ansiConvert.toHtml(msg)
                : msg
              : ""
            if (first) {
              logLines.push({
                timestamp:
                  logItem["timestamp"] || Number(logItem["@timestamp"]),
                entry: converted,
                hasAnsi: msgHasAnsi,
              })
              first = false
            } else {
              logLines.push({ entry: converted, hasAnsi: msgHasAnsi })
            }
          })
        logLines[logLines.length - 1].separator = true
      })
    setLines(() => logLines)
  }, [logs, filter])

  function getRegexFromString(filter: string) {
    const flags = filter.match(/.*\/([gimy]*)$/)
    if (flags) {
      const pattern = flags
        ? filter.replace(new RegExp("^/(.*?)/" + flags[1] + "$"), "$1")
        : filter
      filter.replace(new RegExp("^/(.*?)/" + flags[1] + "$"), "$1")
      return new RegExp(pattern, flags[1])
    } else {
      return new RegExp(filter, "i")
    }
  }

  function fetchMore(direction: Direction) {
    getLogs(
      false,
      direction,
      direction === "prev"
        ? logs[logs.length - 1].timestamp
        : logs[0].timestamp,
    )
  }

  const onWheel = debounce(fetchMore, 500, {
    maxWait: 0,
    leading: true,
    trailing: false,
  })

  const consoles = useCallback(() => {
    return lines.map((l, index) => (
      <div
        key={`${l.timestamp}-${index}`}
        className={classNames(styles.logLine, {
          [styles.separator]: l.separator,
        })}
      >
        <div className={styles.timestamp}>
          {l.timestamp ? dayjs(l.timestamp).format("YYYY-MM-DD HH:mm:ss") : ""}
        </div>
        {l.hasAnsi ? (
          <div
            className={styles.entry}
            dangerouslySetInnerHTML={{ __html: l.entry }}
          />
        ) : (
          <div className={styles.entry}>{l.entry}</div>
        )}
      </div>
    ))
  }, [lines])

  return (
    <div
      className={styles.console}
      style={{ position: "relative", height: "100%" }}
    >
      {logs.length === 0 ? (
        <div className="noOutputData">
          <i className="i-no-log"></i>
          <h3>NO LOG DATA</h3>
        </div>
      ) : (
        <>
          <header className={styles.header}>
            <div className={styles.hostname}>
              <span>
                <b>Hostname:</b> {logs[0].worker}
              </span>
            </div>
            <Space>
              <Button
                onClick={() => onWheel("next")}
                size="small"
                type="text"
                style={{ color: "#2bf" }}
                icon={<SyncOutlined />}
              >
                Refresh
              </Button>
              <Button
                type="default"
                icon={<DownloadOutlined />}
                onClick={downloadLog}
              >
                Download full log
              </Button>
            </Space>
            <Space className={styles.filter}>
              Filter:
              <Input
                placeholder="Filter By Regex"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value)
                  setRegex(getRegexFromString(e.target.value))
                }}
              />
            </Space>
          </header>
          <div
            ref={ref}
            className={styles.logWrapper}
            onWheel={(e) => {
              if (
                e.deltaY >= 0 ||
                !hasMore ||
                loading ||
                !ref.current ||
                !refChild.current ||
                ref.current?.scrollTop !== 0
              ) {
                return
              }
              onWheel("prev")
            }}
          >
            <div ref={refChild}>
              <>{consoles()}</>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
