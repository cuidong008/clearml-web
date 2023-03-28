import REQ from "@/api"
import {
  ProjectGroupsGetAllResponse,
  ProjectsCreateRequest,
  ProjectsCreateResponse,
  ProjectsDeleteRequest,
  ProjectsDeleteResponse,
  ProjectsGetAllExRequest,
  ProjectsGetAllExResponse,
  ProjectsGetUniqueMetricVariantsRequest,
  ProjectsGetUniqueMetricVariantsResponse,
  ProjectsSharedGetAllResponse,
  ProjectsUpdateRequest,
  ProjectsUpdateResponse,
  ProjectsValidateDeleteRequest,
  ProjectsValidateDeleteResponse,
} from "@/api/models/project"

export function getAllProjectsEx(request: ProjectsGetAllExRequest) {
  return REQ.post<ProjectsGetAllExResponse>("/projects.get_all_ex", request)
}

export function projectCreate(request: ProjectsCreateRequest) {
  return REQ.post<ProjectsCreateResponse>("/projects.create", request)
}

export function projectGroupsGetAll() {
  return REQ.get<ProjectGroupsGetAllResponse>("/dr_groups.get_all_ex")
}

export function projectsShareGetAll() {
  return REQ.get<ProjectsSharedGetAllResponse>("/dr_projects.get_shared")
}

export function projectUpdate(request: ProjectsUpdateRequest) {
  return REQ.post<ProjectsUpdateResponse>("/projects.update", request)
}

export function projectDelete(request: ProjectsDeleteRequest) {
  return REQ.post<ProjectsDeleteResponse>("/projects.delete", request)
}

export function projectValidateDelete(request: ProjectsValidateDeleteRequest) {
  return REQ.post<ProjectsValidateDeleteResponse>(
    "/projects.validate_delete",
    request,
  )
}

export function projectsGetUniqueMetricVariants(
  request: ProjectsGetUniqueMetricVariantsRequest,
) {
  return REQ.post<ProjectsGetUniqueMetricVariantsResponse>(
    "/projects.get_unique_metric_variants",
    request,
  )
}
