import { Task } from "@/types/task"
import { createContext, useContext } from "react"

export interface MenuCtx {
  x: number
  y: number
  showMenu: boolean
  showFooter: boolean
  ctxMode: "single" | "multi"
  target: Task | undefined
  selectedTasks: Task[]
  isArchive: boolean
}

export const MenuContext = createContext<MenuCtx>({
  selectedTasks: [],
  showMenu: false,
  ctxMode: "single",
  showFooter: false,
  target: undefined,
  x: 0,
  y: 0,
  isArchive: false,
})

export function useMenuCtx() {
  return useContext(MenuContext)
}
