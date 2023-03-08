import REQ from "@/api";
import { Project } from "@/types/project";

export type StatsForStateEnum = "active" | "archived";

export interface MultiFieldPatternData {
  pattern?: string;
  fields?: Array<string>;
}

export interface ProjectsGetAllExRequest {
  id?: Array<string>;
  name?: string;
  basename?: string;
  description?: string;
  tags?: Array<string>;
  system_tags?: Array<string>;
  order_by?: Array<string>;
  page?: number;
  page_size?: number;
  search_text?: string;
  only_fields?: Array<string>;
  _all_?: MultiFieldPatternData;
  _any_?: MultiFieldPatternData;
  include_stats?: boolean;
  stats_for_state?: StatsForStateEnum;
  non_public?: boolean;
  active_users?: Array<string>;
  shallow_search?: boolean;
  check_own_contents?: boolean;
  search_hidden?: boolean;
  scroll_id?: string;
  refresh_scroll?: boolean;
  size?: number;
  stats_with_children?: boolean;
  include_stats_filter?: object;
  include_dataset_stats?: boolean;
  permission_roots_only?: boolean;
  allow_public?: boolean;
}

export interface ProjectsGetAllExResponse {
  projects?: Array<Project>;
  own_tasks?: number;
  own_models?: number;
  scroll_id?: string;
}

export function getAllProjectsEx(request: ProjectsGetAllExRequest) {
  return REQ.post<ProjectsGetAllExResponse>("/projects.get_all_ex", request);
}
