import { TaskStatusEnumType } from "@/types/enums"
import { MultiFieldPatternData } from "@/types/common"
import { Task } from "@/types/task"

export interface TasksGetAllExRequest {
  id?: Array<string>
  name?: string
  user?: Array<string>
  project?: Array<string>
  page?: number
  page_size?: number
  order_by?: Array<string>
  type?: Array<string>
  tags?: Array<string>
  started?: Array<string | null>
  system_tags?: Array<string>
  status?: Array<TaskStatusEnumType>
  only_fields?: Array<string>
  parent?: Array<string>
  status_changed?: Array<string>
  search_text?: string
  _all_?: MultiFieldPatternData
  _any_?: MultiFieldPatternData
  include_subprojects?: boolean
  search_hidden?: boolean
  scroll_id?: string | null
  refresh_scroll?: boolean
  size?: number
  allow_public?: boolean
}

export interface TasksGetAllExResponse {
  tasks: Array<Task>
  scroll_id?: string
}

export interface TasksUpdateRequest {
  task: string
  name?: string
  tags?: Array<string>
  system_tags?: Array<string>
  comment?: string
  project?: string
  output__error?: string
  created?: string
}

export interface TasksUpdateResponse {
  updated?: number
  fields?: object
}
