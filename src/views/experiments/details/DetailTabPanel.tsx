import { Execution } from "../tabs/Execution"
import styles from "./index.module.scss"
import { Information } from "@/views/experiments/tabs/Information"
import React from "react"
import { Console } from "@/views/experiments/tabs/Console"
import { useDetailCtx } from "@/views/experiments/details/DetailContext"

export const DetailTabPanel = () => {
  const ctx = useDetailCtx()

  return (
    <div className={styles.tabBody}>
      {ctx.activeTab === "execution" && <Execution />}
      {ctx.activeTab === "info" && <Information />}
      {ctx.activeTab === "console" && <Console />}
    </div>
  )
}
