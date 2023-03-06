import useTheme from "@/hooks/useTheme";
import { AuthRouter } from "@/router";
import { setLanguage } from "@/store/app/app.actions";
import { getBrowserLang } from "@/utils/global";
import { ConfigProvider, theme } from "antd";
import enUS from "antd/es/locale/en_US";
import zhCN from "antd/es/locale/zh_CN";
import i18n from "i18next";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import LayoutIndex from "@/layout";

const { darkAlgorithm, defaultAlgorithm } = theme;
const App = (props: any) => {
  const { language, themeConfig, setLanguage } = props;
  const [i18nLocale, setI18nLocale] = useState(zhCN);

  // 全局使用主题
  useTheme(themeConfig);

  // 设置 antd 语言国际化
  const setAntdLanguage = () => {
    // 如果 redux 中有默认语言就设置成 redux 的默认语言，没有默认语言就设置成浏览器默认语言
    if (language && language == "zh") return setI18nLocale(zhCN);
    if (language && language == "en") return setI18nLocale(enUS);
    if (getBrowserLang() == "zh") return setI18nLocale(zhCN);
    if (getBrowserLang() == "en") return setI18nLocale(enUS);
  };

  useEffect(() => {
    // 全局使用国际化
    i18n.changeLanguage(language || getBrowserLang());
    setLanguage(language || getBrowserLang());
    setAntdLanguage();
  }, [language]);
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
        <AuthRouter>
          <LayoutIndex />
        </AuthRouter>
      </BrowserRouter>
    </ConfigProvider>
  );
};
const mapStateToProps = (state: any) => state.app;
const mapDispatchToProps = { setLanguage };
export default connect(mapStateToProps, mapDispatchToProps)(App);
