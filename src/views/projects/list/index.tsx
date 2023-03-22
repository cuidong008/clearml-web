import { ProjectListHeaderCom } from "@/views/projects/ProjectListHeader"
import styles from "./index.module.scss"
import { Button } from "antd"
import { ProjectNewDialog } from "@/views/projects/ProjectNewDialog"
import { useCallback, useEffect, useRef, useState } from "react"
import { ProjectCard } from "@/components/ProjectCard"
import { getAllProjectsEx } from "@/api/project"
import { ProjectConfState, StoreState } from "@/types/store"
import { connect } from "react-redux"
import { Project } from "@/types/project"
import { CurrentUser } from "@/types/user"

const ProjectList = (props: ProjectConfState & { user?: CurrentUser }) => {
  const { showScope, sortOrder, orderBy, groupId, user } = props
  const [newProjDialog, setNewProjDialog] = useState(false)
  const [scrollId, setScrollId] = useState<string>()
  const [hasMore, setHasMore] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])

  const fetchProjects = useCallback(
    (reload: boolean) => {
      let active_user: Record<string, any> = {}
      if (showScope === "public" && groupId === "") {
        return
      }
      if (showScope === "my" && !user) {
        return
      }
      active_user =
        showScope === "my"
          ? { active_users: [user ? user.id : ""] }
          : showScope === "public"
          ? { active_users: [groupId] }
          : {}
      getAllProjectsEx({
        stats_for_state: "active",
        include_stats: true,
        order_by: ["featured", sortOrder === "desc" ? "-" + orderBy : orderBy],
        size: 12,
        permission_roots_only: true,
        search_hidden: true,
        shallow_search: true,
        ...active_user,
        allow_public: false,
        scroll_id: reload ? null : scrollId ?? null,
        only_fields: [
          "name",
          "company",
          "user",
          "created",
          "default_output_destination",
          "basename",
        ],
      }).then(({ data }) => {
        if (reload) {
          setProjects(data.projects)
        } else {
          setProjects(projects.concat(data.projects))
        }
        setHasMore(data.projects.length >= 12)
        if (data.scroll_id && data.scroll_id !== scrollId) {
          setScrollId(data.scroll_id)
        } else {
          setScrollId(undefined)
        }
      })
    },
    [showScope, scrollId, orderBy, sortOrder, groupId],
  )

  const fetchDataRef = useRef(fetchProjects)

  useEffect(() => {
    fetchDataRef.current = fetchProjects
  }, [fetchProjects])

  useEffect(() => {
    fetchDataRef.current(true)
  }, [])

  useEffect(() => {
    fetchDataRef.current(true)
  }, [orderBy, sortOrder, groupId, showScope])

  function projectEditAction(action: string, project?: Project, data?: any) {
    switch (action) {
      case "rename":
        console.log(project, data)
        break
      case "share":
        break
      case "delete":
        break
    }
  }

  return (
    <div className={styles.projectList}>
      <ProjectNewDialog
        show={newProjDialog}
        onClose={(e) => {
          setNewProjDialog(false)
          e && fetchProjects(true)
        }}
      />
      <div className={styles.listBody}>
        <header className={styles.header}>
          <ProjectListHeaderCom />
          <Button
            icon={<i className="al-icon al-ico-add" />}
            onClick={() => setNewProjDialog(true)}
          >
            NEW PROJECT
          </Button>
        </header>
        {projects.map((r, i) => (
          <ProjectCard
            project={r}
            key={r.id}
            showMenu={showScope === "my"}
            dispatch={projectEditAction}
          />
        ))}
        {hasMore && !!scrollId && (
          <div className={styles.loadMore}>
            <Button onClick={() => fetchProjects(false)}>LOAD MORE</Button>
          </div>
        )}
      </div>
    </div>
  )
}
const mapStateToProps = (state: StoreState) => ({
  ...state.project,
  user: state.app.user,
})
export default connect(mapStateToProps, {})(ProjectList)
