import { RouteObject } from "@/types/router";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { lazyLoad } from "./utils";

export const AuthRouter = (props: { children: JSX.Element }) => {
  const { children } = props;
  const { pathname } = useLocation();
  if (pathname.includes("/share")) {
    return children;
  }
  // * 判断是否有Token
  const token = localStorage.getItem("authTk"); //store.getState().user.token;
  if (!token) return <Navigate to="/login" replace />;
  // todo add auth logic
  // * 当前账号有权限返回 Router，正常访问页面
  return children;
};

export const rootRouter: Array<RouteObject> = [
  {
    path: "/",
    name: "home",
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
    element: lazyLoad(React.lazy(() => import("@/views/projects"))),
    name: "projects",
    meta: {
      requiresAuth: true,
      title: "Projects",
      icon: "al-ico-projects",
    },
    children: [
      {
        path: ":projId/experiments",
        name: "a",
        element: <div id="2"></div>,
      },
    ],
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
    element: lazyLoad(React.lazy(() => import("@/views/workerAndQueues"))),
    name: "workers-and-queues",
    meta: {
      requiresAuth: true,
      title: "Workers/Queues",
      icon: "al-ico-queues",
    },
    children: [
      {
        path: "workers",
        name: "workers",
        element: <div id="2"></div>,
      },
      {
        path: "queues",
        name: "queues",
        element: <div id="3"></div>,
      },
    ],
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
    path: "/share",
    hidden: true,
    name: "share",
    element: <div />,
  },
  {
    path: "/403",
    name: "403",
    element: lazyLoad(React.lazy(() => import("@/components/errors/403"))),
  },
  {
    path: "/404",
    name: "404",
    element: lazyLoad(React.lazy(() => import("@/components/errors/404"))),
  },
  {
    path: "/500",
    name: "500",
    element: lazyLoad(React.lazy(() => import("@/components/errors/500"))),
  },
  {
    path: "*",
    name: "hide",
    element: <Navigate to="/404" />,
  },
];
