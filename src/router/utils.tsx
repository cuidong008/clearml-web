import { RouteObject } from "@/types/router";
import React from "react";

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
