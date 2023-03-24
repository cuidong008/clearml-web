import { toggleSideBar } from "@/store/app/app.actions"
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { useDispatch } from "react-redux"
import styles from "./index.module.scss"
import { useStoreSelector } from "@/store"

export const Hamburger = () => {
  const sidebarCollapsed = useStoreSelector(
    (state) => state.app.sidebarCollapsed,
  )
  const dispatch = useDispatch()
  return (
    <div
      className={styles.collapsed}
      onClick={() => {
        dispatch(toggleSideBar())
      }}
    >
      {sidebarCollapsed ? (
        <MenuUnfoldOutlined id="isCollapse" />
      ) : (
        <MenuFoldOutlined id="isCollapse" />
      )}
    </div>
  )
}
