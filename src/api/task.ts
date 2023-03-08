import { MultiFieldPatternData } from "@/types/common";
import { TaskStatusEnum } from "@/types/enums";
import { Task } from "@/types/task";
import REQ from "@/api/index";
import {
  ProjectsGetAllExRequest,
  ProjectsGetAllExResponse,
} from "@/api/project";

export interface TasksGetAllExRequest {
  id?: Array<string>;
  name?: string;
  user?: Array<string>;
  project?: Array<string>;
  page?: number;
  page_size?: number;
  order_by?: Array<string>;
  type?: Array<string>;
  tags?: Array<string>;
  system_tags?: Array<string>;
  status?: Array<TaskStatusEnum>;
  only_fields?: Array<string>;
  parent?: string;
  status_changed?: Array<string>;
  search_text?: string;
  _all_?: MultiFieldPatternData;
  _any_?: MultiFieldPatternData;
  include_subprojects?: boolean;
  search_hidden?: boolean;
  scroll_id?: string;
  refresh_scroll?: boolean;
  size?: number;
  allow_public?: boolean;
}

export interface TasksGetAllExResponse {
  tasks?: Array<Task>;
  scroll_id?: string;
}

export function getAllTasksEx(request: TasksGetAllExRequest) {
  return REQ.post<TasksGetAllExResponse>("/tasks.get_all_ex", request);
}
