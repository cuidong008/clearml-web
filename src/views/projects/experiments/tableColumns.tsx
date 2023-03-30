import { Button, DatePicker, Space, Tag, Tooltip, Typography } from "antd"
import dayjs from "dayjs"
import * as React from "react"
import { ColumnType } from "antd/es/table"
import { FilterDropdownProps } from "antd/es/table/interface"
import { TaskIconLabel } from "@/components/TaskIconLabel"
import { transformDateToPeriod } from "@/utils/transformer"
import { TaskStatusLabel } from "@/components/TaskStatusLabel"
import { Task } from "@/types/task"

export interface ColumnDefine<T> extends Omit<ColumnType<T>, "dataIndex"> {
  dataIndex: keyof T
  getter: string[]
  title: string
  filterable?: boolean
  valuePath?: string
}

export const timeFilter = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  close,
}: FilterDropdownProps) => (
  <div style={{ padding: 10, background: "#47527a" }}>
    <div>
      <div>From</div>
      <Space>
        <DatePicker
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          allowClear
          onChange={(e) => {
            if (e) {
              if (selectedKeys.length === 0) {
                setSelectedKeys([`${e.format("YYYY-MM-DD HH:mm")},`])
              } else {
                setSelectedKeys([
                  `${e.format("YYYY-MM-DD HH:mm")},${
                    selectedKeys[0].toString().split(",")[1]
                  }`,
                ])
              }
            } else {
              if (selectedKeys.length > 0) {
                setSelectedKeys([
                  `,${selectedKeys[0].toString().split(",")[1]}`,
                ])
              } else {
                setSelectedKeys([","])
              }
            }
          }}
        />
      </Space>
    </div>
    <div>
      <div>To</div>
      <Space>
        <DatePicker
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          allowClear
          onChange={(e) => {
            if (e) {
              if (selectedKeys.length === 0) {
                setSelectedKeys([`,${e.format("YYYY-MM-DD HH:mm")}`])
              } else {
                setSelectedKeys([
                  `${selectedKeys[0].toString().split(",")[0]},${e.format(
                    "YYYY-MM-DD HH:mm",
                  )}`,
                ])
              }
            } else {
              if (selectedKeys.length > 0) {
                setSelectedKeys([
                  `${selectedKeys[0].toString().split(",")[0]}, `,
                ])
              } else {
                setSelectedKeys([","])
              }
            }
          }}
        />
      </Space>
    </div>
    <Space
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        padding: 6,
      }}
    >
      <Button
        size={"small"}
        onClick={() => {
          clearFilters?.()
          confirm()
        }}
      >
        reset
      </Button>
      <Button type={"primary"} size={"small"} onClick={() => confirm()}>
        ok
      </Button>
    </Space>
  </div>
)

export const colsSelectableMap: Record<string, ColumnDefine<Task>> = {
  ID: {
    getter: [],
    dataIndex: "id",
    title: "ID",
    width: 100,
  },
  TYPE: {
    getter: [],
    dataIndex: "type",
    title: "TYPE",
    sorter: true,
    filterable: true,
    render: (type) => <TaskIconLabel type={type} showLabel iconClass="md" />,
    width: 115,
  },
  NAME: {
    getter: [],
    dataIndex: "name",
    title: "NAME",
    sorter: true,
    width: 400,
    render: (name) => (
      <Tooltip title={name} color={"blue"}>
        <Typography.Text ellipsis style={{ width: 360, fontWeight: 500 }}>
          {name}
        </Typography.Text>
      </Tooltip>
    ),
  },
  TAGS: {
    getter: [],
    dataIndex: "tags",
    title: "TAGS",
    sorter: false,
    filterable: true,
    valuePath: "",
    render: (tags: string[]) => (
      <>
        {tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </>
    ),
    width: 300,
  },
  USER: {
    getter: ["user.name"],
    dataIndex: "user",
    title: "USER",
    sorter: false,
    filterable: true,
    valuePath: "user.name",
    filterSearch: true,
    render: (user) => user.name,
    width: 115,
  },
  STARTED: {
    getter: [],
    dataIndex: "started",
    title: "STARTED",
    sorter: true,
    filterable: true,
    filterDropdown: timeFilter,
    render: (started) =>
      started ? transformDateToPeriod(dayjs(started).toDate().getTime()) : "",
    width: 150,
  },
  STATUS: {
    getter: [],
    dataIndex: "status",
    title: "STATUS",
    filterable: true,
    sorter: false,
    render: (status) => <TaskStatusLabel status={status} showLabel showIcon />,
    width: 115,
  },
  LAST_UPDATE: {
    getter: [],
    dataIndex: "last_update",
    title: "UPDATED",
    sorter: true,
    defaultSortOrder: "descend",
    filterable: true,
    filterDropdown: timeFilter,
    render: (last_update) =>
      last_update
        ? transformDateToPeriod(dayjs(last_update).toDate().getTime())
        : "",
    width: 150,
  },
  LAST_ITERATION: {
    getter: [],
    dataIndex: "last_iteration",
    title: "ITERATION",
    filterable: true,
    sorter: true,
    width: 115,
  },
  COMMENT: {
    getter: [],
    dataIndex: "comment",
    title: "DESCRIPTION",
    sorter: true,
    width: 300,
    render: (comment) => (
      <Tooltip title={comment} color={"blue"}>
        <Typography.Text ellipsis style={{ width: 260 }}>
          {comment}
        </Typography.Text>
      </Tooltip>
    ),
  },
  ACTIVE_DURATION: {
    getter: [],
    dataIndex: "active_duration",
    title: "RUN TIME",
    sorter: true,
    filterable: true,
    width: 150,
  },
  PARENT: {
    getter: ["parent.name", "parent.project.id", "parent.project.name"],
    dataIndex: "parent",
    title: "PARENT TASK",
    sorter: false,
    filterable: true,
    valuePath: "parent.name",
    filterSearch: true,
    render: (parent) => parent?.name ?? "",
    width: 200,
  },
}

export const DEFAULT_COLS: string[] = [
  "type",
  "name",
  "tags",
  "user",
  "started",
  "status",
  "last_update",
  "last_iteration",
  "comment",
  "active_duration",
  "parent",
]

export function getExperimentTableCols(cols: string[]) {
  const columns: ColumnDefine<Task>[] = []
  cols.forEach((col) => {
    const defCol = colsSelectableMap[col.toUpperCase()]
    if (defCol) {
      columns.push(defCol)
    }
  })
  return columns
}
