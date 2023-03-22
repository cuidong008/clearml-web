import REQ from "@/api"
import { CurrentUser } from "@/types/user"

export interface UsersGetCurrentUserResponse {
  user?: CurrentUser
  getting_started?: object
}

export function getCurrentUser() {
  return REQ.post<UsersGetCurrentUserResponse>("/users.get_current_user", {
    get_supported_features: true,
  })
}
