import REQ from "@/api/index"
import {
  TasksArchiveManyRequest,
  TasksArchiveManyResponse,
  TasksArchiveRequest,
  TasksArchiveResponse,
  TasksGetAllExRequest,
  TasksGetAllExResponse,
  TasksUnArchiveManyRequest,
  TasksUnArchiveManyResponse,
  TasksUpdateRequest,
  TasksUpdateResponse,
} from "./models/task"
import { SortMeta } from "@/types/common"
import {
  ColumnDefine,
  SP_TOKEN,
} from "@/views/projects/experiments/columnFilterLibs"
import { FilterMap, Task } from "@/types/task"
import { flatten } from "lodash"
import { TaskStatusEnumType } from "@/types/enums"
import { hasValue } from "@/utils/global"

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
const extractFilter = (field: string, filters?: FilterMap) => {
  return filters?.[field]?.value?.map((f) => f.toString())
}
export const createFiltersFromStore = (
  _tableFilters: FilterMap | undefined,
  removeEmptyValues = true,
) => {
  if (!_tableFilters) {
    return []
  }
  return Object.keys(_tableFilters).reduce(
    (returnTableFilters, currentFilterName) => {
      const value = _tableFilters?.[currentFilterName]?.value
      if (removeEmptyValues && (!hasValue(value) || value?.length === 0)) {
        return returnTableFilters
      }
      if (Array.isArray(value) && value[0]) {
        const filter = value[0].toString()
        if (filter.includes(SP_TOKEN) && filter !== SP_TOKEN) {
          const part = filter.split(SP_TOKEN)
          returnTableFilters[currentFilterName] = part.map((p) =>
            p !== "" ? p : null,
          )
        }
      } else {
        returnTableFilters[currentFilterName] = value
      }
      return returnTableFilters
    },
    {} as Record<string, any>,
  )
}

export function getGetAllQuery({
  refreshScroll = false,
  scrollId = null,
  projectId,
  cols,
  filters,
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
  filters?: FilterMap
  orderFields?: SortMeta[]
  selectedIds?: string[]
  deep?: boolean
  isCompare?: boolean
  pageSize?: number
  cols: ColumnDefine<Task>[]
}): TasksGetAllExRequest {
  const tagsFilter = filters?.["tags"]?.value?.[0].toString()
  const statusFilter = extractFilter("status", filters)
  const typeFilter = extractFilter("type", filters)
  const tagsFilterAnd = tagsFilter?.includes("^&")
  const userFilter = extractFilter("user", filters)
  const parentFilter = extractFilter("parent", filters)
  const systemTagsFilter = archived
    ? ["__$and", "archived"]
    : ["__$and", "__$not", "archived", "__$not", "pipeline"]
  const selectCols = flatten<string>(
    cols.map((col) => (col.getter.length ? col.getter : [col.dataIndex])),
  )
  const otherFilters = createFiltersFromStore(filters, true)
  const only_fields = [
    "execution",
    ...new Set([...MINIMUM_ONLY_FIELDS, ...selectCols]),
  ]
  return {
    ...otherFilters,
    id: selectedIds,
    project: [projectId],
    scroll_id: scrollId || null, // null to create new scroll (undefined doesn't generate scroll)
    refresh_scroll: refreshScroll,
    size: pageSize,
    order_by: encodeOrder(orderFields),
    type: typeFilter,
    user: userFilter && userFilter?.length > 0 ? userFilter : [],
    ...(statusFilter &&
      statusFilter.length && { status: statusFilter as TaskStatusEnumType[] }),
    ...(parentFilter && parentFilter.length > 0 && { parent: parentFilter }),
    ...(systemTagsFilter?.length > 0 && { system_tags: systemTagsFilter }),
    ...(tagsFilter && {
      tags: [
        tagsFilterAnd ? "__$and" : "__$or",
        ...tagsFilter.split(tagsFilterAnd ? "^&" : "^|"),
      ],
    }),
    // include_subprojects: deep && !projectFilter,
    search_hidden: true,
    only_fields,
  }
}

export function getTasksAllEx(request: TasksGetAllExRequest) {
  return REQ.post<TasksGetAllExResponse>("/tasks.get_all_ex", request)
}

export function tasksUpdate(request: TasksUpdateRequest) {
  return REQ.post<TasksUpdateResponse>("/tasks.update", request)
}

export function tasksArchive(request: TasksArchiveRequest) {
  return REQ.post<TasksArchiveResponse>("/tasks.archive", request)
}

export function tasksArchiveMany(request: TasksArchiveManyRequest) {
  return REQ.post<TasksArchiveManyResponse>("/tasks.archive_many", request)
}

export function tasksUnArchiveMany(request: TasksUnArchiveManyRequest) {
  return REQ.post<TasksUnArchiveManyResponse>("/tasks.unarchive_many", request)
}
