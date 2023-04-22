import {
  EventsGetTaskLogRequest,
  EventsGetTaskLogResponse,
} from "@/api/models/event"
import REQ from "@/api"

export function eventsGetTaskLog(request: EventsGetTaskLogRequest) {
  return REQ.post<EventsGetTaskLogResponse>("/events.get_task_log", request)
}

export function getLog(taskId: string) {
  return REQ.get("/events.download_task_log?line_type=text&task=" + taskId)
}
