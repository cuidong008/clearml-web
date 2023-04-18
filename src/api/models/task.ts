import { TaskStatusEnumType, TaskTypeEnumType } from "@/types/enums"
import { MultiFieldPatternData } from "@/types/common"
import {
  ConfigurationItem,
  Container,
  Execution,
  ParamsItem,
  Script,
  Task,
  TaskModelItem,
  TaskModels,
} from "@/types/task"

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

export interface TasksUnArchiveManyRequest {
  ids: Array<string>
  status_reason?: string
  status_message?: string
}

export interface TasksOpManyResponseError {
  codes?: Array<number>
  msg?: string
  data?: object
}

export interface TasksOpManyResponseFailed {
  id: string
  error: TasksOpManyResponseError
}

export interface TasksUnArchiveManyResponseSucceeded {
  id?: string
  unarchived?: boolean
}

export interface TasksUnArchiveManyResponse {
  succeeded?: Array<TasksUnArchiveManyResponseSucceeded>
  failed?: Array<TasksOpManyResponseFailed>
}

export interface TasksArchiveRequest {
  tasks: Array<string>
  status_reason?: string
  status_message?: string
}

export interface TasksArchiveResponse {
  archived?: number
}

export interface TasksArchiveManyRequest {
  ids: Array<string>
  status_reason?: string
  status_message?: string
}

export interface TasksArchiveManyResponse {
  succeeded?: Array<{ id: string }>
  failed?: Array<TasksOpManyResponseFailed>
}

export interface TasksGetByIdExRequest {
  id?: Array<string>
  name?: string
  user?: Array<string>
  project?: Array<string>
  page?: number
  page_size?: number
  order_by?: Array<string>
  type?: Array<string>
  tags?: Array<string>
  system_tags?: Array<string>
  status?: Array<TaskStatusEnumType>
  only_fields?: Array<string>
  parent?: string
  status_changed?: Array<string>
  search_text?: string
  _all_?: MultiFieldPatternData
  _any_?: MultiFieldPatternData
  input_view_entries_version?: Array<string>
}

export interface TasksGetByIdExResponse {
  tasks?: Array<Task>
}

export interface TasksDeleteManyRequest {
  ids: Array<string>
  move_to_trash?: boolean
  force?: boolean
  return_file_urls?: boolean
  delete_output_models?: boolean
  delete_external_artifacts?: boolean
}

export interface TaskUrls {
  model_urls?: Array<string>
  event_urls?: Array<string>
  artifact_urls?: Array<string>
}

export interface TasksDeleteManyResponseSucceeded {
  id?: string
  deleted?: boolean
  updated_children?: number
  updated_models?: number
  deleted_models?: number
  urls?: TaskUrls
}

export interface TasksDeleteManyResponse {
  succeeded?: Array<TasksDeleteManyResponseSucceeded>
  failed?: Array<TasksOpManyResponseFailed>
}

export interface TasksResetManyRequest {
  ids: Array<string>
  force?: boolean
  clear_all?: boolean
  return_file_urls?: boolean
  delete_output_models?: boolean
  delete_external_artifacts?: boolean
}

export interface TasksResetManyResponseSucceeded {
  id?: string
  dequeued?: boolean
  updated?: number
  fields?: object
  deleted_models?: number
  urls?: TaskUrls
}

export interface TasksResetManyResponse {
  succeeded?: Array<TasksResetManyResponseSucceeded>
  failed?: Array<TasksOpManyResponseFailed>
}

export interface TasksStopManyRequest {
  ids: Array<string>
  status_reason?: string
  status_message?: string
  force?: boolean
}

export interface TasksStopManyResponseSucceeded {
  id?: string
  updated?: number
  fields?: object
}

export interface TasksStopManyResponse {
  succeeded?: Array<TasksStopManyResponseSucceeded>
  failed?: Array<TasksOpManyResponseFailed>
}

export interface TasksPublishManyRequest {
  ids: Array<string>
  status_reason?: string
  status_message?: string
  force?: boolean
  publish_model?: boolean
}

export interface TasksPublishManyResponse {
  succeeded?: Array<TasksStopManyResponseSucceeded>
  failed?: Array<TasksOpManyResponseFailed>
}

export interface TasksCloneRequest {
  task: string
  new_task_name?: string
  new_task_comment?: string
  new_task_tags?: Array<string>
  new_task_system_tags?: Array<string>
  new_task_parent?: string
  new_task_project?: string
  new_task_hyperparams?: { [key: string]: { [key: string]: ParamsItem } }
  new_task_configuration?: { [key: string]: ConfigurationItem }
  execution_overrides?: Execution
  validate_references?: boolean
  new_project_name?: string
  new_task_input_models?: Array<TaskModelItem>
  new_task_container?: { [key: string]: string }
}

export interface TasksCloneResponse {
  id?: string
  new_project?: {
    id?: string
    name?: string
  }
}

export interface TasksMoveRequest {
  ids: Array<string>
  project?: string
  project_name?: string
}

export interface TasksMoveResponse {
  project_id: string
}

export interface TasksEditRequest {
  task: string
  force?: boolean
  name?: string
  tags?: Array<string>
  system_tags?: Array<string>
  type?: TaskTypeEnumType
  comment?: string
  parent?: string
  project?: string
  output_dest?: string
  execution?: Execution
  hyperparams?: { [key: string]: { [key: string]: ParamsItem } }
  configuration?: { [key: string]: ConfigurationItem }
  script?: Script
  models?: TaskModels
  container?: Container
  runtime?: object
}

export interface TasksEditResponse {
  updated?: number
  fields?: object
}
