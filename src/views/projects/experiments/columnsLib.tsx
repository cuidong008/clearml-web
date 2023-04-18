import React from "react"
import dayjs from "dayjs"
import { ColumnDefine, Task } from "@/types/task"
import { TaskIconLabel } from "@/components/TaskIconLabel"
import { Typography } from "antd"
import { transformDateToPeriod } from "@/utils/transformer"
import { map } from "lodash"
import { TASKS_STATUS_LABELS } from "@/types/enums"
import { TaskStatusLabel } from "@/components/TaskStatusLabel"
import { NumFilter, TagsFilter, TimeFilter } from "./customFilters"
import { TagList } from "@/components/TagList"
import { SP_TOKEN } from "@/utils/constant"

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

export function getTasksTableCols(cols: string[]) {
  const columns: ColumnDefine<Task>[] = []
  cols.forEach((col) => {
    const defCol = colsSelectableMap[col.toUpperCase()]
    if (defCol) {
      columns.push(defCol)
    }
  })
  return columns
}

export const TASK_INFO_ONLY_FIELDS_BASE = [
  "id",
  "name",
  "user.name",
  "company",
  "type",
  "status",
  "status_changed",
  "status_message",
  "status_reason",
  "comment",
  "created",
  "last_update",
  "last_change",
  "completed",
  "started",
  "parent.name",
  "parent.project.name",
  "project.name",
  "output",
  "hyperparams",
  "execution.queue.name",
  "script.binary",
  "script.repository",
  "script.tag",
  "script.branch",
  "script.version_num",
  "script.entry_point",
  "script.working_dir",
  "script.requirements",
  "system_tags",
  "published",
  "last_iteration",
  "last_worker",
  "tags",
  "active_duration",
  "container",
  "runtime",
]

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
      <Typography.Text
        ellipsis={{
          tooltip: { color: "blue", title: name, placement: "bottom" },
        }}
        style={{ width: 360, fontWeight: 500 }}
      >
        {name}
      </Typography.Text>
    ),
  },
  TAGS: {
    getter: [],
    dataIndex: "tags",
    title: "TAGS",
    sorter: false,
    filterable: true,
    filterDropdown: TagsFilter,
    render: (tags: string[], record: Task) => (
      <TagList
        style={{ width: 300 }}
        sysTags={record.system_tags}
        tags={tags}
      />
    ),
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
    filters: map(TASKS_STATUS_LABELS, (k, v) => ({ value: v, text: k })),
    sorter: false,
    render: (status, task) => (
      <TaskStatusLabel
        progress={task?.runtime?.progress}
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
      <Typography.Text
        ellipsis={{
          tooltip: { color: "blue", title: comment, placement: "bottom" },
        }}
        style={{ width: 260 }}
      >
        {comment}
      </Typography.Text>
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
