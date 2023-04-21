export interface EventLog {
  timestamp: number
  type: string
  task: string
  level: "debug" | "info" | "warning" | "error" | "critical"
  worker: string
  msg: string
  model_event: boolean
  "@timestamp": string
  metric: string
  variant: string
}
