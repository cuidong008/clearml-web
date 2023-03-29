import REQ from "@/api/index"
import { TasksGetAllExRequest, TasksGetAllExResponse } from "./models/task"

export function getTasksAllEx(request: TasksGetAllExRequest) {
  return REQ.post<TasksGetAllExResponse>("/tasks.get_all_ex", request)
}
