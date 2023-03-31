import { RouteObject } from "@/types/router"
import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { Dashboard } from "@/views/dashboard"
import { Projects } from "@/views/projects"
import WorkerAndQueues from "@/views/workerAndQueues"
import NotAuth from "@/components/errors/403"
import NotFound from "@/components/errors/404"
import NotNetwork from "@/components/errors/500"
import { Overview } from "@/views/projects/overview"
import progress from "nprogress"
import { ProjectList } from "@/views/projects/list"
import { Experiments } from "@/views/projects/experiments"

progress.configure({
  easing: "ease", // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
})

export const AuthRouter = (props: { children: JSX.Element }) => {
  progress.start()
  const { children } = props
  const { pathname } = useLocation()
  if (pathname.includes("/share")) {
    return children
  }
  // * 判断是否有Token
  const token = localStorage.getItem("authTk") //store.getState().user.token;
  if (!token) return <Navigate to="/login" replace />
  // todo add auth logic
  // * 当前账号有权限返回 Router，正常访问页面
  progress.done()
  return children
}

export const rootRouter: Array<RouteObject> = [
  {
    path: "/",
    name: "home",
    element: <Navigate to={"/dashboard"} />,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    element: <Dashboard />,
    meta: {
      requiresAuth: false,
      title: "Dashboard",
      icon: "al-ico-home",
    },
  },
  {
    path: "/projects",
    element: <Projects />,
    name: "projects",
    meta: {
      requiresAuth: true,
      title: "Projects",
      icon: "al-ico-projects",
    },
    children: [
      {
        path: ":projId/projects",
        name: "projectsChilds",
        element: <ProjectList />,
      },
      {
        path: ":projId/experiments",
        name: "experiments",
        element: <Experiments />,
      },
      {
        path: ":projId/overview",
        name: "overview",
        element: <Overview />,
      },
      {
        path: ":projId/models",
        name: "models",
        element: <div id="3"></div>,
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
    element: <WorkerAndQueues />,
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
    element: <NotAuth />,
  },
  {
    path: "/404",
    name: "404",
    element: <NotFound />,
  },
  {
    path: "/500",
    name: "500",
    element: <NotNetwork />,
  },
  {
    path: "*",
    name: "hide",
    element: <Navigate to="/404" />,
  },
]
