export interface User {
  id?: string
  name?: string
  given_name?: string
  family_name?: string
  avatar?: string
  company?: string
  role?: string
  providers?: object
  created?: string
  email?: string
}

export interface CurrentUser {
  id: string
  name?: string
  given_name?: string
  family_name?: string
  role?: string
  avatar?: string
  company?: {
    id?: string
    name?: string
  }
  email?: string
  preferences?: object
}
