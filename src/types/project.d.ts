export interface SubProject {
  id: string
  name: string
}

export interface DatasetStats {
  file_count?: number
  total_size?: number
}

export interface StatsStatusCount {
  total_runtime?: number
  total_tasks?: number
  completed_tasks_24h?: number
  last_task_run?: string
  status_count?: StatsStatusCountStatusCount
}

export interface StatsStatusCountStatusCount {
  created?: number
  completed?: number
  queued?: number
  in_progress?: number
  stopped?: number
  published?: number
  closed?: number
  failed?: number
  unknown?: number
  publishing?: number
}

export interface Stats {
  active?: StatsStatusCount
  archived?: StatsStatusCount
}

export interface Group {
  id: string
  name: string
}

export interface Project {
  id: string
  name: string
  basename?: string
  description?: string
  user?: { id: string }
  company?: { id: string; name?: string }
  created?: string
  tags?: Array<string>
  system_tags?: Array<string>
  default_output_destination?: string
  stats?: Stats
  dataset_stats?: DatasetStats
  last_update?: string
  sub_projects?: SubProject[]
  own_tasks?: number
  own_models?: number
}

export interface ReadyForDeletion {
  project: Project
  experiments: {
    total: number
    archived: number
    unarchived: number
  }
  models: {
    total: number
    archived: number
    unarchived: number
  }
}

export type StatsForStateEnum = "active" | "archived"
