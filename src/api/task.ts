import REQ from "@/api/index"
import { TasksGetAllExRequest, TasksGetAllExResponse } from "./models/task"
import { SortMeta } from "@/types/common"
import { ColumnDefine } from "@/views/projects/experiments/tableColumns"
import { Task } from "@/types/task"
import { flatten } from "lodash"

export const encodeOrder = (orders: SortMeta[]): string[] =>
  orders.map((order) => `${order.order === -1 ? "-" : ""}${order.field}`)
export const MINIMUM_ONLY_FIELDS: string[] = [
  "name",
  "status",
  "system_tags",
  "project",
  "company",
  "last_change",
  "started",
  "last_iteration",
  "tags",
  "user.name",
  "runtime.progress",
]

export function getGetAllQuery({
  refreshScroll = false,
  scrollId = null,
  projectId,
  cols,
  archived,
  orderFields = [],
  selectedIds = [],
  isCompare,
  pageSize = 15,
}: {
  refreshScroll?: boolean
  scrollId: string | null
  projectId: string
  archived: boolean
  orderFields?: SortMeta[]
  selectedIds?: string[]
  deep?: boolean
  isCompare?: boolean
  pageSize?: number
  cols: ColumnDefine<Task>[]
}): TasksGetAllExRequest {
  const systemTagsFilter = archived
    ? ["__$and", "archived"]
    : ["__$and", "__$not", "archived", "__$not", "pipeline"]
  const selectCols = flatten<string>(
    cols.map((col) => (col.getter.length ? col.getter : [col.dataIndex])),
  )
  const only_fields = [...new Set([...MINIMUM_ONLY_FIELDS, ...selectCols])]
  return {
    id: selectedIds,
    project: [projectId],
    scroll_id: scrollId || null, // null to create new scroll (undefined doesn't generate scroll)
    refresh_scroll: refreshScroll,
    size: pageSize,
    order_by: encodeOrder(orderFields),
    // status: [],
    type: [],
    user: [],
    ...(systemTagsFilter?.length > 0 && { system_tags: systemTagsFilter }),
    // include_subprojects: deep && !projectFilter,
    search_hidden: true,
    only_fields,
  }
}

export function getTasksAllEx(request: TasksGetAllExRequest) {
  return REQ.post<TasksGetAllExResponse>("/tasks.get_all_ex", request)
}
