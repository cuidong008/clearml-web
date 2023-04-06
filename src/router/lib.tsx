import { Navigate, useLocation } from "react-router-dom"

export const AuthRouter = (props: { children: JSX.Element }) => {
  const { children } = props
  const { pathname } = useLocation()
  if (pathname.includes("/share")) {
    return children
  }
  // * 判断是否有Token
  const token = localStorage.getItem("authTk") //store.getState().user.token;
  if (!token) return <Navigate to="/login" replace />
  // todo add auth logic
  // * 当前账号有权限返回 Router，正常访问页面
  return children
}
