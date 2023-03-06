import NProgress from "@/components/NProgress";
import { RouteObject } from "@/types/router";
import React, { Suspense } from "react";

export const lazyLoad = (
  Comp: React.LazyExoticComponent<any>
): React.ReactNode => {
  return (
    <Suspense fallback={<NProgress />}>
      <Comp />
    </Suspense>
  );
};

/**
 * @description 递归查询对应的路由
 * @param {String} path 当前访问地址
 * @param {Array} routes 路由列表
 * @returns array
 */
export const searchRouter = (
  path: string,
  routes: RouteObject[] = []
): RouteObject => {
  let result: RouteObject = {};
  for (const item of routes) {
    if (item.path === path) return item;
    if (item.children) {
      const res = searchRouter(path, item.children);
      if (Object.keys(res).length) result = res;
    }
  }
  return result;
};

/**
 * @description 使用递归处理路由菜单，生成一维数组，做菜单权限判断
 * @param {Array<any>} routerList 所有菜单列表
 * @param {Array} newArr 菜单的一维数组
 * @return array
 */
export function handleRouter(routerList: Array<any>, newArr: string[] = []) {
  routerList.forEach((item: any) => {
    typeof item === "object" && item.path && newArr.push(item.path);
    item.children &&
      item.children.length &&
      handleRouter(item.children, newArr);
  });
  return newArr;
}

export const filterAsyncRouter = (routers: Array<any>) => {
  // 遍历后台传来的路由字符串，转换为组件对象
  return routers.filter((router: any) => {
    router.meta.noCache = false;
    //外链
    if (router.iframe) {
      return true;
    }
    //多级菜单
    if (router.com) {
      if (router.com === "Index") {
        // Layout组件特殊处理
        router.alwaysShow = true;
        if (router.children.length > 0) {
          router.redirect = `noRedirect`;
        }
      } else {
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children);
    }
    return true;
  });
};

/**
 * @description 获取需要展开的 subMenu
 * @param {String} path 当前访问地址
 * @returns array
 */
export const getOpenKeys = (path: string) => {
  let newStr = "";
  const newArr: any[] = [];
  const arr = path.split("/").map((i) => "/" + i);
  for (let i = 1; i < arr.length - 1; i++) {
    newStr += arr[i];
    newArr.push(newStr);
  }
  return newArr;
};
