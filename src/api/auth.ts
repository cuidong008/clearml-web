import axios from "axios"

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
