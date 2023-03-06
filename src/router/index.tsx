import { RouteObject } from "@/types/router";
import React from "react";
import { Navigate } from "react-router-dom";
import { lazyLoad } from "./utils";

export const AuthRouter = (props: { children: JSX.Element }) => {
  const { children } = props;

  // * 判断是否有Token
  const token = "123"; //store.getState().user.token;
  if (!token) return <Navigate to="/login" replace />;
  // todo add auth logic
  // * 当前账号有权限返回 Router，正常访问页面
  return children;
};

export const rootRouter: Array<RouteObject> = [
  {
    path: "/",
    element: <Navigate to={"/dashboard"} />,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    element: lazyLoad(React.lazy(() => import("@/views/dashboard"))),
    meta: {
      requiresAuth: false,
      title: "Dashboard",
      icon: "al-ico-home",
    },
  },
  {
    path: "/projects",
    element: <div />,
    name: "projects",
    meta: {
      requiresAuth: true,
      title: "Projects",
      icon: "al-ico-projects",
    },
  },
  {
    path: "/pipelines",
    element: <div />,
    name: "pipelines",
    meta: {
      requiresAuth: true,
      title: "Pipelines",
      icon: "al-ico-pipelines",
    },
  },
  {
    path: "/datasets",
    element: <div />,
    name: "datasets",
    meta: {
      requiresAuth: true,
      title: "Datasets",
      icon: "al-ico-datasets",
    },
  },
  {
    path: "/reports",
    element: <div />,
    name: "reports",
    meta: {
      requiresAuth: true,
      title: "Reports",
      icon: "al-ico-reports",
    },
  },
  {
    path: "/workers-and-queues",
    element: <div />,
    name: "workers-and-queues",
    meta: {
      requiresAuth: true,
      title: "Workers/Queues",
      icon: "al-ico-queues",
    },
  },
  {
    path: "/settings",
    element: <div />,
    name: "settings",
    hidden: true,
    meta: {
      requiresAuth: true,
      title: "Settings",
      icon: "al-ico-home",
    },
  },
  {
    path: "/403",
    element: lazyLoad(React.lazy(() => import("@/components/errors/403"))),
  },
  {
    path: "/404",
    element: lazyLoad(React.lazy(() => import("@/components/errors/404"))),
  },
  {
    path: "/500",
    element: lazyLoad(React.lazy(() => import("@/components/errors/500"))),
  },
  {
    path: "*",
    element: <Navigate to="/404" />,
  },
];
