import { CurrentUser, User } from "@/types/user"
import { UserPreference } from "@/types/store"

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

export interface UsersGetPreferencesResponse {
  preferences?: UserPreference
}

export interface UsersSetPreferencesRequest {
  preferences: UserPreference
}

export interface UsersSetPreferencesResponse {
  updated?: number
  fields?: object
}
