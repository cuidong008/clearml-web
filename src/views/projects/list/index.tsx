import { ProjectListHeaderCom } from "@/views/projects/ProjectListHeader"
import styles from "./index.module.scss"
import { Button, message } from "antd"
import { ProjectNewDialog } from "@/views/projects/ProjectNewDialog"
import { useCallback, useEffect, useRef, useState } from "react"
import { ProjectCard } from "@/components/ProjectCard"
import {
  getAllProjectsEx,
  projectUpdate,
  projectValidateDelete,
} from "@/api/project"
import { ProjectConfState, StoreState } from "@/types/store"
import { connect } from "react-redux"
import { Project, ReadyForDeletion } from "@/types/project"
import { CurrentUser } from "@/types/user"
import { ProjectDeleteDialog } from "@/views/projects/ProjectDeleteDialog"

const ProjectList = (props: ProjectConfState & { user?: CurrentUser }) => {
  const { showScope, sortOrder, orderBy, groupId, user } = props
  const [newProjDialog, setNewProjDialog] = useState(false)
  const [delProjDialog, setDelProjDialog] = useState(false)
  const [scrollId, setScrollId] = useState<string>()
  const [hasMore, setHasMore] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectProject, setSelectProject] = useState<Project>()
  const [readyDelete, setReadyDelete] = useState<ReadyForDeletion>()

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
        ...(showScope !== "my" && { stats_get_all: true }),
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
      }).then(({ data, meta }) => {
        if (meta.result_code !== 200) {
          message.error(meta.result_msg)
          return
        }
        if (reload) {
          setProjects(() => data.projects)
        } else {
          setProjects(() => projects.concat(data.projects))
        }
        setHasMore(data.projects.length >= 12)
        if (data.scroll_id && data.scroll_id !== scrollId) {
          setScrollId(data.scroll_id)
        } else {
          setScrollId(undefined)
        }
      })
    },
    [projects, user, showScope, scrollId, orderBy, sortOrder, groupId],
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

  function validateProjectDel(project: Project) {
    projectValidateDelete({ project: project.id })
      .then(({ data, meta }) => {
        if (meta.result_code !== 200) {
          message.error(meta.result_msg)
          return
        }
        const readyForDeletion: ReadyForDeletion = {
          project: project,
          experiments: {
            total: data.tasks ?? 0,
            archived: data.tasks
              ? data.tasks - (data.non_archived_tasks ?? 0)
              : 0,
            unarchived: data.non_archived_tasks ?? 0,
          },
          models: {
            total: data.models ?? 0,
            archived: data.models
              ? data.models - (data.non_archived_models ?? 0)
              : 0,
            unarchived: data.non_archived_models ?? 0,
          },
        }
        setReadyDelete(readyForDeletion)
        setDelProjDialog(true)
      })
      .catch(() => {
        message.error("validate project delete failure")
      })
  }

  function projectEditAction(action: string, project?: Project, data?: string) {
    switch (action) {
      case "setEditProj":
        setSelectProject(project)
        break
      case "rename":
        if (project && data) {
          projectRename(project, data)
        }
        break
      case "share":
        break
      case "delete":
        if (project) {
          validateProjectDel(project)
        }
        break
    }
  }

  function projectRename(project: Project, newName: string) {
    projectUpdate({ project: project.id, name: newName })
      .then(({ data, meta }) => {
        if (meta.result_code !== 200) {
          message.error(meta.result_msg)
          return
        }
        setProjects(() =>
          projects.map((p) => {
            if (p.id === project.id) {
              p = { ...p, ...data.fields }
            }
            return p
          }),
        )
        setSelectProject(undefined)
        message.success(
          `update project name "${project.name}" to "${newName}" success`,
        )
      })
      .catch((err) => {
        message.error(`update project ${project.name}'s name failure`)
      })
  }

  return (
    <div className={styles.projectList}>
      <ProjectDeleteDialog
        show={delProjDialog}
        readyForDeletion={readyDelete}
        onClose={(e) => {
          setDelProjDialog(false)
          if (e) {
            setReadyDelete(undefined)
          }
        }}
      />
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
            editProjId={selectProject?.id}
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
