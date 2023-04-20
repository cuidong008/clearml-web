import { useDetailCtx } from "./DetailContext"
import { Execution } from "../tabs/Execution"
import styles from "./index.module.scss"
import { Information } from "@/views/experiments/tabs/Information"

export const DetailTabPanel = () => {
  const ctx = useDetailCtx()

  return (
    <div className={styles.tabBody}>
      {ctx.activeTab === "execution" && <Execution />}
      {ctx.activeTab === "info" && <Information />}
    </div>
  )
}
