import Logo from "@/layout/sidebar/Logo";
import { searchRouter } from "@/router/utils";
import { setMenuList } from "@/store/app/app.actions";
import type { MenuProps } from "antd";
import { Menu, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { rootRouter } from "@/router";
import styles from "./index.module.scss";

const LayoutMenu = (props: {
  menuList?: any;
  getUserDetail?: any;
  sidebarCollapsed?: any;
  setBreadCrumbList?: any;
  setAuthRouter?: any;
  setMenuList?: any;
}) => {
  let init = false;
  const { pathname } = useLocation();
  const { sidebarCollapsed, setBreadCrumbList, setMenuList } = props;
  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  // 刷新页面菜单保持高亮
  useEffect(() => {
    const key = `/${pathname.split("/")[1]}`;
    setSelectedKeys([key]);
  }, [pathname, sidebarCollapsed]);

  // 定义 menu 类型
  type MenuItem = Required<MenuProps>["items"][number];
  const getItem = (
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  };

  // 处理后台返回菜单 key 值为 antd 菜单需要的 key 值
  const deepLoopFloat = (menuList: any[], newArr: MenuItem[] = []) => {
    menuList.forEach((item: any) => {
      if (!item.meta || item.hidden) return;
      if (!item?.children?.length)
        return newArr.push(
          getItem(
            item.meta.title,
            item.path,
            <i className={`menu-icon ${item.meta.icon}`} />
          )
        );
      newArr.push(
        getItem(
          item.meta.title,
          item.path,
          <i className={`menu-icon ${item.meta.icon}`} />
          // deepLoopFloat(item.children)
        )
      );
    });
    return newArr;
  };

  /**
   * @description 递归当前路由的 所有 关联的路由，生成面包屑导航栏
   * @param {String} path 当前访问地址
   * @param {Array} menuList 菜单列表
   * @returns array
   */
  const getBreadcrumbList = (path: string, menuList: Array<any>) => {
    const tempPath: any[] = [];
    try {
      const getNodePath = (node: any) => {
        tempPath.push(node);
        // 找到符合条件的节点，通过throw终止掉递归
        if (node.path === path) {
          throw new Error("GOT IT!");
        }
        if (node.children && node.children.length > 0) {
          for (let i = 0; i < node.children.length; i++) {
            getNodePath(node.children[i]);
          }
          // 当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
          tempPath.pop();
        } else {
          // 找到叶子节点时，删除路径当中的该叶子节点
          tempPath.pop();
        }
      };
      for (let i = 0; i < menuList.length; i++) {
        getNodePath(menuList[i]);
      }
    } catch (e) {
      return tempPath.map((item) => {
        return { name: item.name, icon: item.meta?.icon };
      });
    }
  };

  /**
   * @description 双重递归 找出所有 面包屑 生成对象存到 redux 中，就不用每次都去递归查找了
   * @param {String} menuList 当前菜单列表
   * @returns object
   */
  const findAllBreadcrumb = (menuList: Array<any>): { [key: string]: any } => {
    const handleBreadcrumbList: any = {};
    const loop = (menuItem: any) => {
      // 下面判断代码解释 *** !item?.children?.length   ==>   (item.children && item.children.length > 0)
      if (menuItem?.children?.length)
        menuItem.children.forEach((item: any) => loop(item));
      else
        handleBreadcrumbList[menuItem.path] = getBreadcrumbList(
          menuItem.path,
          menuList
        );
    };
    menuList.forEach((item) => loop(item));
    return handleBreadcrumbList;
  };
  // 获取菜单列表并处理成 antd menu 需要的格式

  const getMenuData = async () => {
    setLoading(true);
    try {
      setMenus(deepLoopFloat(rootRouter));
      setBreadCrumbList(findAllBreadcrumb(rootRouter));
      setMenuList(rootRouter);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!init) {
      getMenuData().then();
      init = true;
    }
  }, []);

  // 点击当前菜单跳转页面
  const navigate = useNavigate();
  const clickMenu: MenuProps["onClick"] = ({ key }: { key: string }) => {
    const route = searchRouter(key, props.menuList);
    if (route.iframe) {
      window.open(route.path, "_blank");
      return;
    }
    if (key == pathname) {
      return;
    }
    navigate(key);
  };

  return (
    <div className={styles.menu}>
      <Spin spinning={loading} tip="Loading...">
        <Logo></Logo>
        <Menu
          mode="inline"
          triggerSubMenuAction="hover"
          selectedKeys={selectedKeys}
          items={menus}
          onClick={clickMenu}
        />
      </Spin>
    </div>
  );
};

const mapStateToProps = (state: any) => state.app;
const mapDispatchToProps = { setMenuList };
export default connect(mapStateToProps, mapDispatchToProps)(LayoutMenu);
