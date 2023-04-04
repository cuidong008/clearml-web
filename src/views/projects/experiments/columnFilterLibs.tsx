import { ColumnType } from "antd/es/table"
import React from "react"
import dayjs from "dayjs"
import { Task } from "@/types/task"
import { TaskIconLabel } from "@/components/TaskIconLabel"
import { Tooltip, Typography } from "antd"
import { transformDateToPeriod } from "@/utils/transformer"
import { map } from "lodash"
import { EXPERIMENTS_STATUS_LABELS } from "@/types/enums"
import { TaskStatusLabel } from "@/components/TaskStatusLabel"
import {
  NumFilter,
  TagsFilter,
  TimeFilter,
} from "@/views/projects/experiments/tableColumns"
import { TagList } from "@/components/TagList"

export interface ColumnDefine<T> extends Omit<ColumnType<T>, "dataIndex"> {
  dataIndex: keyof T
  getter: string[]
  title: string
  filterable?: boolean
  valuePath?: string
  labelPath?: string
}

export const SP_TOKEN = "$-$"

export const parseTimeVal = (selectedKeys: React.Key[], index: number) => {
  return selectedKeys[0] && `${selectedKeys[0]}`.split(SP_TOKEN)[index]
    ? dayjs(`${selectedKeys[0]}`.split(SP_TOKEN)[index])
    : null
}

export const parseNumVal = (selectedKeys: React.Key[], index: number) => {
  return selectedKeys[0] && `${selectedKeys[0]}`.split(SP_TOKEN)[index]
    ? `${selectedKeys[0]}`.split(SP_TOKEN)[index]
    : null
}

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
    filterDropdown: TagsFilter,
    render: (tags: string[]) => <TagList style={{ width: 300 }} tags={tags} />,
    width: 300,
  },
  USER: {
    getter: ["user.name"],
    dataIndex: "user",
    title: "USER",
    sorter: false,
    filterable: true,
    valuePath: "user.id",
    labelPath: "user.name",
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
    filterDropdown: TimeFilter,
    render: (started) =>
      started ? transformDateToPeriod(dayjs(started).toDate().getTime()) : "",
    width: 150,
  },
  STATUS: {
    getter: [],
    dataIndex: "status",
    title: "STATUS",
    filters: map(EXPERIMENTS_STATUS_LABELS, (k, v) => ({ value: v, text: k })),
    sorter: false,
    render: (status, exp) => (
      <TaskStatusLabel
        progress={exp?.runtime?.progress}
        status={status}
        showLabel
        showIcon
      />
    ),
    width: 115,
  },
  LAST_UPDATE: {
    getter: [],
    dataIndex: "last_update",
    title: "UPDATED",
    sorter: true,
    defaultSortOrder: "descend",
    filterable: true,
    filterDropdown: TimeFilter,
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
    filterDropdown: NumFilter,
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
    filterDropdown: NumFilter,
    width: 150,
  },
  PARENT: {
    getter: ["parent.name", "parent.project.id", "parent.project.name"],
    dataIndex: "parent",
    title: "PARENT TASK",
    sorter: false,
    filterable: true,
    valuePath: "parent.id",
    labelPath: "parent.name",
    filterSearch: true,
    render: (parent) => parent?.name ?? "",
    width: 200,
  },
}
