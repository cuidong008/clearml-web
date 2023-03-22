/**
 * @description 全局主题设置
 * */
import { ThemeConfigState } from "@/types/store"

const useTheme = (themeConfig: ThemeConfigState) => {
  const { isDark } = themeConfig
  const initTheme = () => {
    // 灰色和弱色切换
    const body = document.documentElement as HTMLElement
    isDark
      ? body.setAttribute("data-type", "dark")
      : body.setAttribute("data-type", "light")
  }
  initTheme()

  return {
    initTheme,
  }
}

export default useTheme
