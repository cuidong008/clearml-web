import logo from "@/assets/icons/logo.svg"
import styles from "./index.module.scss"
import { useStoreSelector } from "@/store"

export const Logo = () => {
  const sidebarCollapsed = useStoreSelector(
    (state) => state.app.sidebarCollapsed,
  )
  const themeConfig = useStoreSelector((state) => state.app.themeConfig)
  return (
    <div
      className={styles.logoBox}
      style={{ background: themeConfig.isDark ? "#00001f" : "#2c3246" }}
    >
      <img src={logo} alt="logo" className={styles.logoImg} />
      {!sidebarCollapsed ? (
        <h2 className={styles.logoText}>Deekeeper</h2>
      ) : null}
    </div>
  )
}
