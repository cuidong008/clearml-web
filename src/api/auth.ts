import REQ from "@/api"
import axios from "axios"

export const AUTH_TOKEN_KEY = "Authorization"
export const PASSWORD_KEY = "UserCredential"

export type UserCredentials = {
  username: string
  password: string
}
type GetAccessTokenReq = {
  username: string
  password: string
}

type GetAccessTokenRes = {
  data: {
    access_token: string
    email: string
    email_verified: string
  }
}

export function GetAccessToken(params: GetAccessTokenReq) {
  return axios.post<GetAccessTokenRes>(
    `/auth/evaluation/sso-password`,
    {},
    {
      params,
    },
  )
}
