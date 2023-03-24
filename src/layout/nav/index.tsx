import { Hamburger } from "@/layout/nav/Hamburger"
import { ThemeToggle } from "@/components/ThemeToggle"
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  SettingOutlined,
} from "@ant-design/icons"
import { Space } from "antd"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import Breadcrumbs from "./Breadcrumbs"
import styles from "./index.module.scss"

export const NavHeader = (props: {
  breadCrumbList: Record<string, Array<any>>
}) => {
  const { breadCrumbList } = props
  const { pathname } = useLocation()
  const [full, setFull] = useState(false)
  const breadCrumbs = breadCrumbList[pathname] || []

  function fullScreen() {
    const element = document.documentElement
    if (element.requestFullscreen) {
      setFull(true)
      element.requestFullscreen()
    }
  }

  //退出全屏
  function exitFullscreen() {
    if (document.exitFullscreen) {
      setFull(false)
      document.exitFullscreen()
    }
  }

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <Hamburger />
        <Breadcrumbs breadCrumbs={breadCrumbs} />
      </div>
      <Space className={styles.headerRight}>
        <Space size={"small"}>
          <ThemeToggle />
          <SettingOutlined style={{ fontSize: "16px", cursor: "pointer" }} />
          {full ? (
            <FullscreenExitOutlined
              style={{ fontSize: "16px", cursor: "pointer" }}
              onClick={exitFullscreen}
            />
          ) : (
            <FullscreenOutlined
              style={{ fontSize: "16px", cursor: "pointer" }}
              onClick={fullScreen}
            />
          )}
        </Space>
      </Space>
    </div>
  )
}
