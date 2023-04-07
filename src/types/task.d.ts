import {
  ArtifactModeEnum,
  TaskStatusEnumType,
  TaskTypeEnumType,
} from "@/types/enums"
import { Project } from "@/types/project"
import { Model } from "@/types/model"
import { User } from "@/types/user"
import { Queue } from "@/types/queue"
import { FilterValue } from "antd/es/table/interface"
import { Key } from "react"

export interface Output {
  destination?: string
  model?: string
  result?: string
  error?: string
}

export interface ArtifactTypeData {
  preview?: string
  content_type?: string
  data_hash?: string
}

export interface Artifact {
  key: string
  type: string
  mode?: ArtifactModeEnum
  uri?: string
  content_size?: number
  hash?: string
  timestamp?: number
  type_data?: ArtifactTypeData
  display_data?: Array<Array<string>>
}

export interface Execution {
  queue?: string
  parameters?: object
  model?: string
  model_desc?: object
  model_labels?: { [key: string]: number }
  framework?: string
  docker_cmd?: string
  artifacts?: Array<Artifact>
}

export interface IBaseExecution extends Omit<Execution, "model" | "queue"> {
  model: Model
  queue: Queue
}

export type IExecution = IBaseExecution

export interface TaskModels {
  input?: Array<TaskModelItem>
  output?: Array<TaskModelItem>
}

export interface TaskModelItem {
  name: string
  model: IModelInfo
}

export interface IModelInfo extends Omit<Model, "project" | "task"> {
  project?: Project
  task?: ITask
  taskName?: string
}

export interface ItaskOutput {
  view: ITaskView
  destination: string
  model: Model
  result: string
  error: string
}

export interface ITaskView {
  entries: Array<ITaskViewEntry>
}

export interface ITaskViewEntry {
  version: string
  dataset: string
}

export interface ITask
  extends Omit<
    Task,
    "user" | "parent" | "project" | "execution" | "output" | "company"
  > {
  user?: User
  parent?: string | ITask
  project?: Project
  execution?: IExecution
  output: ItaskOutput
  company: {
    id?: string
    name?: string
  }
}

export interface Container {
  image?: string
  arguments?: string
  setup_shell_script?: string
}

export interface Script {
  binary?: string
  repository?: string
  tag?: string
  branch?: string
  version_num?: string
  entry_point?: string
  working_dir?: string
  requirements?: object
  diff?: string
}

export interface ConfigurationItem {
  name?: string
  value?: string
  type?: string
  description?: string
}

export interface Task {
  id: string
  name?: string
  user?: { id: string; name?: string }
  company?: { id: string; name?: string }
  type?: TaskTypeEnumType
  status?: TaskStatusEnumType
  comment?: string
  created?: string
  ready?: boolean
  started?: string
  completed?: string
  active_duration?: number
  parent?: { id: string; name: string; project?: { id: string } }
  project?: string
  input?: { bindingPropertyName?: string }
  output?: Output
  execution?: Execution
  models?: TaskModels
  container?: Container
  script?: Script
  tags?: Array<string>
  system_tags?: Array<string>
  status_changed?: string
  status_message?: string
  status_reason?: string
  published?: string
  last_worker?: string
  last_worker_report?: string
  last_update?: string
  last_change?: string
  last_iteration?: number
  last_metrics?: { [key: string]: any }
  hyperparams?: { [key: string]: any }
  configuration?: { [key: string]: ConfigurationItem }
  runtime?: { [key: string]: string }
}

export interface ITask
  extends Omit<
    Task,
    "user" | "parent" | "project" | "execution" | "output" | "company"
  > {
  user?: User
  parent?: string | ITask
  project?: Project
  execution?: IExecution
  output: ItaskOutput
  company: {
    id?: string
    name?: string
  }
}

export type FilterMap = Record<
  string,
  { value: FilterValue | null; path: string }
>

export interface SelectedTask {
  keys: Key[]
  rows: Task[]
}
