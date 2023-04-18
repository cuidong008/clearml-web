import { useDetailCtx } from "./DetailContext"
import { Execution } from "@/views/experiments/tabs/Execution"

export const DetailTabPanel = () => {
  const ctx = useDetailCtx()

  return <div>{ctx.activeTab === "execution" && <Execution />}</div>
}
