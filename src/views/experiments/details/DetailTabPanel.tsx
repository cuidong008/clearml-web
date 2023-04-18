import { useDetailCtx } from "./DetailContext"
import { Execution } from "../tabs/Execution"
import styles from "./index.module.scss"

export const DetailTabPanel = () => {
  const ctx = useDetailCtx()

  return (
    <div className={styles.tabBody}>
      {ctx.activeTab === "execution" && <Execution />}
    </div>
  )
}
