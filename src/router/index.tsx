import { RouteObject } from "@/types/router"
import React from "react"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom"
import { Dashboard } from "@/views/dashboard"
import { Projects } from "@/views/projects"
import WorkerAndQueues from "@/views/workerAndQueues"
import NotAuth from "@/components/errors/403"
import NotFound from "@/components/errors/404"
import NotNetwork from "@/components/errors/500"
import { Overview } from "@/views/projects/overview"
import { ProjectList } from "@/views/projects/list"
import { Experiments } from "@/views/projects/experiments"
import { LayoutIndex } from "@/layout"
import { Login } from "@/layout/login"
import { DetailTabPanel } from "@/views/projects/experiments/details/DetailTabPanel"

export const rootRouter: Array<RouteObject> = [
  {
    path: "/dashboard",
    name: "dashboard",
    async lazy() {
      const { Dashboard } = await import("@/views/dashboard")
      return { Component: Dashboard }
    },
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
        children: [
          {
            path: ":expId/details",
            name: "experimentDetails",
            element: <DetailTabPanel />,
          },
          {
            path: ":expId/:output/details",
            name: "experimentDetails",
            element: <DetailTabPanel />,
          },
        ],
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
]

function genRoutes(root: RouteObject[]) {
  return root.map((item) =>
    item.children?.length ? (
      <Route
        key={item.name}
        path={item.path}
        lazy={item.lazy}
        element={item.element}
      >
        {genRoutes(item.children)}
      </Route>
    ) : (
      <Route
        key={item.name}
        path={item.path}
        lazy={item.lazy}
        element={item.element}
      />
    ),
  )
}

const routes = createRoutesFromElements(
  <>
    <Route path={"/"} element={<Navigate to={"/dashboard"} />} />
    <Route path="/" element={<LayoutIndex />}>
      {genRoutes(rootRouter)}
    </Route>
    <Route path={"/login"} element={<Login />} />
    <Route path={"*"} element={<Navigate to={"/404"} />} />
  </>,
)
export const AppRouter = createBrowserRouter(routes)
