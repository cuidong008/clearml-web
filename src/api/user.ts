import REQ from "@/api"
import {
  UsersGetAllExRequest,
  UsersGetAllExResponse,
  UsersGetCurrentUserResponse,
  UsersGetPreferencesResponse,
} from "./models/user"

export function getCurrentUser() {
  return REQ.post<UsersGetCurrentUserResponse>("/users.get_current_user", {
    get_supported_features: true,
  })
}

export function getUserAll(request: UsersGetAllExRequest) {
  return REQ.post<UsersGetAllExResponse>("/users.get_all_ex", request)
}

export function getUserPreferences() {
  return REQ.post<UsersGetPreferencesResponse>("/users.get_preferences", {})
}
