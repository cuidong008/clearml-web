import { Task } from "@/types/task"
import { createContext, useContext } from "react"

export interface DetailCtx {
  activeTab: string
  current: Task | undefined
  setCurrent: (t: Task) => void
}

export const DetailContext = createContext<DetailCtx>({
  activeTab: "execution",
  current: undefined,
  setCurrent: (t: Task) => {
    void t
  },
})

export function useDetailCtx() {
  return useContext(DetailContext)
}
