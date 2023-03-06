import { Layout } from "antd";
import { connect } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./index.scss";
import { useState } from "react";
import { rootRouter } from "@/router";
import NavHeader from "@/layout/nav";
import LayoutMenu from "@/layout/sidebar";

const { Header, Sider, Content } = Layout;

const LayoutIndex = (props: any) => {
  const { themeConfig } = props;
  const [breadCrumbList, setBreadCrumbList] = useState<Record<any, any>>({});

  return (
    <Layout style={{ minHeight: "100vh", minWidth: "100vw" }}>
      <Sider
        collapsed={props.sidebarCollapsed}
        theme={themeConfig.isDark ? "dark" : "light"}
      >
        <LayoutMenu setBreadCrumbList={setBreadCrumbList} />
      </Sider>
      <Layout>
        <Header
          className={`${
            themeConfig.isDark ? "site-header-dark" : "site-header-light"
          }`}
        >
          <NavHeader breadCrumbList={breadCrumbList} />
        </Header>
        <Content style={{ padding: "0 20px" }}>
          <Routes>
            {rootRouter.map((item) => (
              <Route key={item.name} path={item.path} element={item.element} />
            ))}
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = (state: any) => state.app;
export default connect(mapStateToProps, {})(LayoutIndex);
