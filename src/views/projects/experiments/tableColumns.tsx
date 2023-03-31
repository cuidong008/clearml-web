import {
  Button,
  DatePicker,
  InputNumber,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd"
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
export const SP_TOKEN = "$-$"
export const parseTimeVal = (selectedKeys: React.Key[], index: number) => {
  return selectedKeys[0] && selectedKeys[0].toString().split(SP_TOKEN)[index]
    ? dayjs(selectedKeys[0].toString().split(SP_TOKEN)[index])
    : null
}

export const timeFilter = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
}: FilterDropdownProps) => (
  <div style={{ padding: 10, background: "#47527a" }}>
    <div>
      <div>From</div>
      <Space>
        <DatePicker
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          allowClear
          value={parseTimeVal(selectedKeys, 0)}
          onChange={(e) => {
            e
              ? selectedKeys.length
                ? setSelectedKeys([
                    `${e.format("YYYY-MM-DD HH:mm")}${SP_TOKEN}${
                      selectedKeys[0].toString().split(SP_TOKEN)[1]
                    }`,
                  ])
                : setSelectedKeys([
                    `${e.format("YYYY-MM-DD HH:mm")}${SP_TOKEN}`,
                  ])
              : selectedKeys.length
              ? setSelectedKeys([
                  `${SP_TOKEN}${selectedKeys[0].toString().split(SP_TOKEN)[1]}`,
                ])
              : setSelectedKeys([SP_TOKEN])
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
          value={parseTimeVal(selectedKeys, 1)}
          onChange={(e) => {
            e
              ? selectedKeys.length
                ? setSelectedKeys([
                    `${
                      selectedKeys[0].toString().split(SP_TOKEN)[0]
                    }${SP_TOKEN}${e.format("YYYY-MM-DD HH:mm")}`,
                  ])
                : setSelectedKeys([
                    `${SP_TOKEN}${e.format("YYYY-MM-DD HH:mm")}`,
                  ])
              : selectedKeys.length
              ? setSelectedKeys([
                  `${selectedKeys[0].toString().split(SP_TOKEN)[0]}${SP_TOKEN}`,
                ])
              : setSelectedKeys([SP_TOKEN])
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

export const parseNumVal = (selectedKeys: React.Key[], index: number) => {
  return selectedKeys[0] && selectedKeys[0].toString().split(SP_TOKEN)[index]
    ? selectedKeys[0].toString().split(SP_TOKEN)[index]
    : null
}

export const numFilter = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
}: FilterDropdownProps) => (
  <div style={{ padding: 10, background: "#47527a" }}>
    <div>
      <Space>
        <InputNumber
          value={parseNumVal(selectedKeys, 0)}
          onChange={(e) => {
            e
              ? selectedKeys.length
                ? setSelectedKeys([
                    `${e}${SP_TOKEN}${
                      selectedKeys[0].toString().split(SP_TOKEN)[1]
                    }`,
                  ])
                : setSelectedKeys([`${e}${SP_TOKEN}`])
              : selectedKeys.length
              ? setSelectedKeys([
                  `${SP_TOKEN}${selectedKeys[0].toString().split(SP_TOKEN)[1]}`,
                ])
              : setSelectedKeys([SP_TOKEN])
          }}
        />
      </Space>
    </div>
    <div>-</div>
    <div>
      <Space>
        <InputNumber
          value={parseNumVal(selectedKeys, 1)}
          onChange={(e) => {
            e
              ? selectedKeys.length
                ? setSelectedKeys([
                    `${
                      selectedKeys[0].toString().split(SP_TOKEN)[0]
                    }${SP_TOKEN}${e}`,
                  ])
                : setSelectedKeys([`${SP_TOKEN}${e}`])
              : selectedKeys.length
              ? setSelectedKeys([
                  `${selectedKeys[0].toString().split(SP_TOKEN)[0]}${SP_TOKEN}`,
                ])
              : setSelectedKeys([SP_TOKEN])
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
    filterDropdown: numFilter,
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
    filterDropdown: numFilter,
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
