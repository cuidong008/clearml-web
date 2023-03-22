import { toggleSideBar } from "@/store/app/app.actions"
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { connect } from "react-redux"
import styles from "./index.module.scss"

const Hamburger = (props: any) => {
  const { sidebarCollapsed, toggleSideBar } = props

  return (
    <div
      className={styles.collapsed}
      onClick={() => {
        toggleSideBar(!sidebarCollapsed)
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

const mapStateToProps = (state: any) => state.app
const mapDispatchToProps = { toggleSideBar }
export default connect(mapStateToProps, mapDispatchToProps)(Hamburger)
