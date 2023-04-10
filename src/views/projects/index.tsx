import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import { ProjectList } from "./list"
import styles from "./index.module.scss"
import { message, Tabs } from "antd"
import { useCallback, useEffect, useState } from "react"
import { getAllProjectsEx } from "@/api/project"
import { setProjectSelected } from "@/store/project/project.actions"
import { useDispatch } from "react-redux"
import { useStoreSelector } from "@/store"

export const Projects = () => {
  const params = useParams()
  const location = useLocation()
  const selectedProject = useStoreSelector(
    (state) => state.project.selectedProject,
  )
  const [activeKey, setActiveKey] = useState("experiments")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const getProjectById = useCallback(
    (projId: string) => {
      if (projId === selectedProject?.id) {
        return
      }
      getAllProjectsEx({
        stats_for_state: "active",
        include_stats: true,
        size: 1,
        search_hidden: true,
        allow_public: false,
        id: [projId],
        only_fields: [
          "name",
          "company",
          "user",
          "created",
          "default_output_destination",
          "basename",
          "description",
        ],
      }).then(({ data, meta }) => {
        if (meta.result_code !== 200) {
          message.error(meta.result_msg)
          return
        }
        if (data.projects.length) {
          dispatch(setProjectSelected(data.projects[0]))
        }
      })
    },
    [selectedProject],
  )

  useEffect(() => {
    if (params["projId"]) {
      getProjectById(params["projId"])
    } else {
      dispatch(setProjectSelected(undefined))
    }
  }, [getProjectById, params])

  useEffect(() => {
    return () => {
      dispatch(setProjectSelected(undefined))
    }
  }, [])

  useEffect(() => {
    if (location.state && location.state.target) {
      setActiveKey(location.state.target)
    } else {
      const parts = location.pathname.split("/")
      if (parts.length >= 4) {
        setActiveKey(parts[3])
      }
    }
  }, [location])

  function handleTabChange(e: string) {
    navigate(`/projects/${params["projId"]}/${e}`)
    setActiveKey(e)
  }

  return (
    <div className={styles.projects}>
      {params["projId"] && !location.pathname.endsWith("/projects") && (
        <div className={styles.projectsBody}>
          <header className={styles.tabHeader}>
            <Tabs
              activeKey={activeKey}
              onChange={(e) => handleTabChange(e)}
              size="middle"
              centered
              items={[
                { label: "OVERVIEW", key: "overview" },
                { label: "EXPERIMENTS", key: "experiments" },
                { label: "MODELS", key: "models" },
              ]}
            />
          </header>
          <Outlet />
        </div>
      )}
      {params["projId"] && location.pathname.endsWith("/projects") && (
        <Outlet />
      )}
      {!params["projId"] && <ProjectList />}
    </div>
  )
}
