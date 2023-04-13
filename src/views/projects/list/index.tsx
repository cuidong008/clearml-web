import { ProjectListHeader } from "../ProjectListHeader"
import styles from "./index.module.scss"
import { Button, message } from "antd"
import { ProjectNewDialog } from "../ProjectNewDialog"
import { useCallback, useEffect, useRef, useState } from "react"
import { ProjectCard } from "@/components/ProjectCard"
import {
  getAllProjectsEx,
  projectUpdate,
  projectValidateDelete,
} from "@/api/project"
import { Project, ReadyForDeletion } from "@/types/project"
import { ProjectDeleteDialog } from "../ProjectDeleteDialog"
import { ProjectShareDialog } from "../ProjectShareDialog"
import { useStoreSelector } from "@/store"
import { StoreState } from "@/types/store"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setProjectSelected } from "@/store/project/project.actions"

export const ProjectList = () => {
  const {
    showScope,
    sortOrder,
    orderBy,
    groupId,
    sharedProjects,
    selectedProject,
  } = useStoreSelector((state: StoreState) => state.project)
  const user = useStoreSelector((state) => state.app.user)
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const params = useParams()

  const [msg, msgContext] = message.useMessage()

  const [newProjDialog, setNewProjDialog] = useState(false)
  const [delProjDialog, setDelProjDialog] = useState(false)
  const [shareProjDialog, setShareProjDialog] = useState(false)
  const [scrollId, setScrollId] = useState<string>()
  const [hasMore, setHasMore] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectProject, setSelectProject] = useState<Project>()
  const [readyDelete, setReadyDelete] = useState<ReadyForDeletion>()

  function checkQueryCondition(): boolean {
    if (showScope === "public" && groupId === "") {
      return false
    }
    if (showScope === "my" && !user) {
      return false
    }
    return !(showScope === "share" && !sharedProjects.length)
  }

  const fetchProjects = useCallback(
    (reload: boolean) => {
      if (!checkQueryCondition()) {
        return
      }
      const active_user =
        showScope === "my"
          ? { active_users: [user ? user.id : ""] }
          : showScope === "public"
          ? { active_users: [groupId] }
          : {
              id: sharedProjects.length
                ? sharedProjects.map((r) => r.id)
                : ["none"],
            }
      getAllProjectsEx({
        stats_for_state: "active",
        include_stats: true,
        order_by: ["featured", sortOrder === "desc" ? "-" + orderBy : orderBy],
        size: 12,
        ...(params["projId"] && { parent: [params["projId"]] }),
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
      })
        .then(({ data, meta }) => {
          if (meta.result_code !== 200) {
            msg.error(meta.result_msg)
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
        .catch((e) => {
          console.log(e)
        })
    },
    [
      projects,
      user,
      showScope,
      scrollId,
      orderBy,
      sortOrder,
      groupId,
      sharedProjects,
    ],
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
  }, [orderBy, sortOrder, groupId, showScope, sharedProjects])

  function validateProjectDel(project: Project) {
    projectValidateDelete({ project: project.id })
      .then(({ data, meta }) => {
        if (meta.result_code !== 200) {
          msg.error(meta.result_msg)
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
        msg.error("validate project delete failure")
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
        if (project) {
          setShareProjDialog(true)
        }
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
          msg.error(meta.result_msg)
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
        msg.success(
          `update project name "${project.name}" to "${newName}" success`,
        )
      })
      .catch((err) => {
        msg.error(`update project ${project.name}'s name failure`)
      })
  }

  function navigateProject(r: Project, toSelf: boolean) {
    navigate(`/projects/${r.id}/${toSelf ? "projects" : "experiments"}`, {
      state: { target: "experiments" },
    })
    dispatch(setProjectSelected(r))
  }

  return (
    <div className={styles.projectList}>
      {msgContext}
      <ProjectDeleteDialog
        show={delProjDialog}
        readyForDeletion={readyDelete}
        onClose={(e) => {
          setDelProjDialog(false)
          if (e) {
            setReadyDelete(undefined)
            fetchDataRef.current(true)
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
      <ProjectShareDialog
        show={shareProjDialog}
        onClose={() => {
          setShareProjDialog(false)
        }}
      />
      <div className={styles.listBody}>
        <header className={styles.header}>
          <ProjectListHeader />
          <Button
            icon={<i className="al-icon al-ico-add" />}
            onClick={() => setNewProjDialog(true)}
          >
            NEW PROJECT
          </Button>
        </header>
        {!!selectedProject?.sub_projects?.length && (
          <div onClick={() => navigateProject(selectedProject, false)}>
            <ProjectCard
              showMenu={false}
              project={{
                ...selectedProject,
                name: `[${selectedProject.name}]`,
                sub_projects: [],
              }}
            />
          </div>
        )}
        {projects.map((r) => (
          <div
            key={r.id}
            onClick={() => navigateProject(r, !!r.sub_projects?.length)}
          >
            <ProjectCard
              project={r}
              editProjId={selectProject?.id}
              showMenu={showScope === "my"}
              dispatch={projectEditAction}
            />
          </div>
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
