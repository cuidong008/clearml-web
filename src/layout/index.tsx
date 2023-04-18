import { Layout } from "antd"
import { Outlet } from "react-router-dom"
import "./index.scss"
import { useEffect, useState } from "react"
import { AuthRouter } from "@/router/lib"
import { NavHeader } from "@/layout/nav"
import { LayoutMenu } from "@/layout/sidebar"
import { getAllUser, getLoginUser } from "@/store/app/app.actions"
import { useStoreSelector, useThunkDispatch } from "@/store"

const { Header, Sider, Content } = Layout

export const LayoutIndex = () => {
  const sidebarCollapsed = useStoreSelector(
    (state) => state.app.sidebarCollapsed,
  )
  const themeConfig = useStoreSelector((state) => state.app.themeConfig)
  const user = useStoreSelector((state) => state.app.user)
  const dispatch = useThunkDispatch()
  const [breadCrumbList, setBreadCrumbList] = useState<Record<any, any>>({})

  useEffect(() => {
    dispatch(getLoginUser())
    dispatch(getAllUser())
  }, [dispatch])

  return (
    <Layout style={{ minHeight: "100vh", minWidth: "100vw" }}>
      <Sider
        collapsed={sidebarCollapsed}
        theme={themeConfig.isDark ? "dark" : "light"}
      >
        <LayoutMenu setBreadCrumbList={setBreadCrumbList} />
      </Sider>
      <Layout>
        <Header
          className={`${
            themeConfig.isDark ? "site-header-dark" : "site-header-light"
          }`}
        >
          <NavHeader breadCrumbList={breadCrumbList} />
        </Header>
        <Content>
          {user?.id && (
            <AuthRouter>
              <Outlet />
            </AuthRouter>
          )}
        </Content>
      </Layout>
    </Layout>
  )
}
