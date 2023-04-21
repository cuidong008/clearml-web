import { EventLog } from "@/types/event"

export type OrderEnumType = "asc" | "desc"

export interface EventsGetTaskLogRequest {
  task: string
  batch_size?: number
  navigate_earlier?: boolean
  from_timestamp?: number | null
  order?: OrderEnumType
}

export interface EventsGetTaskLogResponse {
  events: Array<EventLog>
  returned: number
  total: number
}
