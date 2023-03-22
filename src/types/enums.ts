export enum CircleTypeEnum {
  completed = "completed",
  running = "running",
  pending = "pending",
  failed = "failed",
  empty = "empty",
  "model-labels" = "model-labels",
}

export type TaskStatusEnum =
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

export const TaskStatusEnum = {
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
}

export type TaskTypeEnum =
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

export const TaskTypeEnum = {
  Training: "training" as TaskTypeEnum,
  Testing: "testing" as TaskTypeEnum,
  Inference: "inference" as TaskTypeEnum,
  DataProcessing: "data_processing" as TaskTypeEnum,
  Application: "application" as TaskTypeEnum,
  Monitor: "monitor" as TaskTypeEnum,
  Controller: "controller" as TaskTypeEnum,
  Optimizer: "optimizer" as TaskTypeEnum,
  Service: "service" as TaskTypeEnum,
  Qc: "qc" as TaskTypeEnum,
  Custom: "custom" as TaskTypeEnum,
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
  [TaskStatusEnum.Failed]: "Failed",
  [TaskStatusEnum.Stopped]: "Completed",
  [TaskStatusEnum.Closed]: "Closed",
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
}
