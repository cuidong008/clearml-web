export enum CircleTypeEnum {
  completed = "completed",
  running = "running",
  pending = "pending",
  failed = "failed",
  empty = "empty",
  "model-labels" = "model-labels",
}

export type TaskStatusEnumType =
  | "created"
  | "queued"
  | "in_progress"
  | "stopped"
  | "published"
  | "publishing"
  | "closed"
  | "failed"
  | "completed"
  | "unknown"
  | "started"

export const TaskStatusEnum: Record<string, TaskStatusEnumType> = {
  Created: "created",
  Queued: "queued",
  InProgress: "in_progress",
  Stopped: "stopped",
  Published: "published",
  Publishing: "publishing",
  Closed: "closed",
  Failed: "failed",
  Completed: "completed",
  Unknown: "unknown",
  Started: "started",
}

export type TaskTypeEnumType =
  | "training"
  | "testing"
  | "inference"
  | "data_processing"
  | "application"
  | "monitor"
  | "controller"
  | "optimizer"
  | "service"
  | "qc"
  | "custom"
  | "unknown"
  | "annotation"
  | "annotation_manual"

export const TaskTypeEnum: Record<string, TaskTypeEnumType> = {
  Training: "training" as TaskTypeEnumType,
  Testing: "testing" as TaskTypeEnumType,
  Inference: "inference" as TaskTypeEnumType,
  DataProcessing: "data_processing" as TaskTypeEnumType,
  Application: "application" as TaskTypeEnumType,
  Monitor: "monitor" as TaskTypeEnumType,
  Controller: "controller" as TaskTypeEnumType,
  Optimizer: "optimizer" as TaskTypeEnumType,
  Service: "service" as TaskTypeEnumType,
  Qc: "qc" as TaskTypeEnumType,
  Custom: "custom" as TaskTypeEnumType,
  Annotation: "annotation",
  ManualAnnotation: "annotation_manual",
}

export type ArtifactModeEnum = "input" | "output"

export const ArtifactModeEnum = {
  Input: "input" as ArtifactModeEnum,
  Output: "output" as ArtifactModeEnum,
}
export const EXPERIMENTS_STATUS_LABELS = {
  [TaskStatusEnum.Created]: "Draft",
  [TaskStatusEnum.Queued]: "Pending",
  [TaskStatusEnum.InProgress]: "Running",
  [TaskStatusEnum.Completed]: "Completed",
  [TaskStatusEnum.Published]: "Published",
  [TaskStatusEnum.Publishing]: "Publishing",
  [TaskStatusEnum.Failed]: "Failed",
  [TaskStatusEnum.Stopped]: "Stopped",
  [TaskStatusEnum.Closed]: "Closed",
  [TaskStatusEnum.Unknown]: "Unknown",
  [TaskStatusEnum.Started]: "Started",
}
export const EXPERIMENTS_TYPE_LABELS = {
  [TaskTypeEnum.Testing]: "Testing",
  [TaskTypeEnum.Training]: "Training",
  [TaskTypeEnum.Inference]: "Inference",
  [TaskTypeEnum.DataProcessing]: "Data Processing",
  [TaskTypeEnum.Application]: "Application",
  [TaskTypeEnum.Monitor]: "Monitor",
  [TaskTypeEnum.Controller]: "Controller",
  [TaskTypeEnum.Optimizer]: "Optimizer",
  [TaskTypeEnum.Service]: "Service",
  [TaskTypeEnum.Qc]: "Qc",
  [TaskTypeEnum.Custom]: "Custom",
  [TaskTypeEnum.ManualAnnotation]: "ManualAnnotation",
  [TaskTypeEnum.Annotation]: "Annotation",
  [TaskTypeEnum.Unknown]: "Unknown",
}
export type CloudProviders = "fs" | "gc" | "s3" | "azure" | "misc"

export type MetricValueType = "min_value" | "max_value" | "value"

export type StatsForStateEnum = "active" | "archived"

export enum ColHeaderTypeEnum {
  sort = "sort",
  sortFilter = "sort-filter",
  checkBox = "checkbox",
  title = "none",
}

export enum ColHeaderFilterTypeEnum {
  duration = "duration", // days-hours-minutes
  durationNumeric = "duration-numeric", // number
  durationDate = "duration-date", // DD-MM-YYYY hours:minutes
}
