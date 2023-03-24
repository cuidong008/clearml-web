import REQ from "@/api"
import { CurrentUser, User } from "@/types/user"

export interface UsersGetCurrentUserResponse {
  user?: CurrentUser
  getting_started?: object
}

export interface UsersGetAllExRequest {
  name?: string
  id?: Array<string>
  only_fields?: Array<string>
  page?: number
  page_size?: number
  order_by?: Array<string>
  active_in_projects?: Array<string>
}

export interface UsersGetAllExResponse {
  users?: Array<User>
}

export function getCurrentUser() {
  return REQ.post<UsersGetCurrentUserResponse>("/users.get_current_user", {
    get_supported_features: true,
  })
}

export function getUserAll(request: UsersGetAllExRequest) {
  return REQ.post<UsersGetAllExResponse>("/users.get_all_ex", request)
}
