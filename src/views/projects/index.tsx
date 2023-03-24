import { Outlet, useParams } from "react-router-dom"
import { ProjectList } from "@/views/projects/list"
import styles from "./index.module.scss"

export const Projects = () => {
  const params = useParams()
  return (
    <div className={styles.projects}>
      {params["projId"] && <Outlet />}
      {!params["projId"] && <ProjectList />}
    </div>
  )
}
