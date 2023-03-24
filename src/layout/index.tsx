import { Layout } from "antd"
import { Route, Routes } from "react-router-dom"
import "./index.scss"
import { useEffect, useState } from "react"
import { AuthRouter, rootRouter } from "@/router"
import { NavHeader } from "@/layout/nav"
import { LayoutMenu } from "@/layout/sidebar"
import { getAllUser, getLoginUser } from "@/store/app/app.actions"
import { useStoreSelector } from "@/store"
import { ThunkActionDispatch } from "redux-thunk"
import { useDispatch } from "react-redux"

const { Header, Sider, Content } = Layout

export const LayoutIndex = () => {
  const sidebarCollapsed = useStoreSelector(
    (state) => state.app.sidebarCollapsed,
  )
  const themeConfig = useStoreSelector((state) => state.app.themeConfig)
  const user = useStoreSelector((state) => state.app.user)
  const dispatch = useDispatch<ThunkActionDispatch<any>>()
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
              <Routes>
                {rootRouter.map((item) =>
                  item.children?.length ? (
                    <Route
                      key={item.name}
                      path={item.path}
                      element={item.element}
                    >
                      {item.children.map((r) => (
                        <Route
                          key={item.name}
                          path={r.path}
                          element={r.element}
                        ></Route>
                      ))}
                    </Route>
                  ) : (
                    <Route
                      key={item.name}
                      path={item.path}
                      element={item.element}
                    />
                  ),
                )}
              </Routes>
            </AuthRouter>
          )}
        </Content>
      </Layout>
    </Layout>
  )
}
