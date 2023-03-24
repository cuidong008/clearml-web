import useTheme from "@/hooks/useTheme"
import { ConfigProvider, theme } from "antd"
import enUS from "antd/es/locale/en_US"
import zhCN from "antd/es/locale/zh_CN"
import i18n from "i18next"
import { useEffect, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { LayoutIndex } from "@/layout"
import { Login } from "@/layout/login"
import { useStoreSelector } from "@/store"

const { darkAlgorithm, defaultAlgorithm } = theme
export const App = () => {
  const themeConfig = useStoreSelector((state) => state.app.themeConfig)
  const language = useStoreSelector((state) => state.app.language)
  const [i18nLocale, setI18nLocale] = useState(enUS)

  // 全局使用主题
  useTheme(themeConfig)

  // 设置 antd 语言国际化
  const setAntdLanguage = () => {
    // 如果 redux 中有默认语言就设置成 redux 的默认语言，没有默认语言就设置成浏览器默认语言
    if (language && language == "zh") return setI18nLocale(zhCN)
    if (language && language == "en") return setI18nLocale(enUS)
  }

  useEffect(() => {
    // 全局使用国际化
    i18n.changeLanguage(language)

    setAntdLanguage()
  }, [setAntdLanguage, language])
  return (
    <ConfigProvider
      locale={i18nLocale}
      theme={{
        algorithm: themeConfig.isDark ? darkAlgorithm : defaultAlgorithm,
        components: {
          Layout: {
            colorBgHeader: themeConfig.isDark ? "#141722" : "#ffffff",
          },
        },
        token: {
          colorBgBase: themeConfig.isDark ? "#1a1e2c" : "#ffffff",
          colorBgContainer: themeConfig.isDark ? "#1a1e2c" : "#ffffff",
          colorBgLayout: themeConfig.isDark ? "#1a1e2c" : "#ffffff",
          colorPrimary: "#5C6BC6",
          colorSuccess: "#21B978",
          colorWarning: "#DDA451",
          colorError: "#EA5455",
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<LayoutIndex />} />
          <Route path={"/login"} element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}
