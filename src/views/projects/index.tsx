import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import { ProjectList } from "@/views/projects/list"
import styles from "./index.module.scss"
import { Tabs } from "antd"
import { useEffect, useState } from "react"

export const Projects = () => {
  const params = useParams()
  const location = useLocation()
  const [activeKey, setActiveKey] = useState("experiments")
  const navigate = useNavigate()

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
      {params["projId"] && (
        <div>
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
      {!params["projId"] && <ProjectList />}
    </div>
  )
}
