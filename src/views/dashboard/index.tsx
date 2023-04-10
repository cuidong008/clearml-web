import { ProjectCard } from "@/components/ProjectCard"
import { useCallback, useEffect, useRef, useState } from "react"
import { Project } from "@/types/project"
import styles from "./index.module.scss"
import { Link, useNavigate } from "react-router-dom"
import { Button, message, Table, Tooltip, Typography } from "antd"
import { getAllProjectsEx } from "@/api/project"
import Column from "antd/es/table/Column"
import { getTasksAllEx } from "@/api/task"
import { Task } from "@/types/task"
import { TaskIconLabel } from "@/components/TaskIconLabel"
import { TaskStatusLabel } from "@/components/TaskStatusLabel"
import dayjs from "dayjs"
import { ProjectNewDialog } from "@/views/projects/ProjectNewDialog"
import { ProjectListHeader } from "@/views/projects/ProjectListHeader"
import { StoreState } from "@/types/store"
import { useStoreSelector } from "@/store"

export const Dashboard = () => {
  const { showScope, sortOrder, orderBy, groupId, sharedProjects } =
    useStoreSelector((state: StoreState) => state.project)
  const user = useStoreSelector((state) => state.app.user)
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const [newProjDialog, setNewProjDialog] = useState(false)
  const navigate = useNavigate()

  function generateUserScopeObj() {
    return showScope === "my"
      ? { active_users: [user ? user.id : ""] }
      : showScope === "public"
      ? { active_users: [groupId] }
      : {
          id: sharedProjects.length
            ? sharedProjects.map((r) => r.id)
            : ["none"],
        }
  }

  function checkQueryCondition(): boolean {
    if (showScope === "public" && groupId === "") {
      return false
    }
    if (showScope === "my" && !user) {
      return false
    }
    return !(showScope === "share" && !sharedProjects.length)
  }

  const fetchRecentProjects = useCallback(() => {
    setProjects([])
    if (!checkQueryCondition()) {
      return
    }
    const active_user = generateUserScopeObj()
    getAllProjectsEx({
      stats_for_state: "active",
      include_stats: true,
      check_own_contents: true,
      ...(showScope !== "my" && { stats_get_all: true }),
      order_by: ["featured", sortOrder === "desc" ? "-" + orderBy : orderBy],
      page: 0,
      page_size: 6,
      ...active_user,
      include_stats_filter: { system_tags: ["-pipeline"] },
      allow_public: false,
      only_fields: [
        "name",
        "company",
        "user",
        "created",
        "default_output_destination",
      ],
    }).then(({ data, meta }) => {
      if (meta.result_code !== 200) {
        message.error(meta.result_msg)
        return
      }
      setProjects(data.projects ?? [])
    })
  }, [showScope, orderBy, sortOrder, groupId, sharedProjects])

  const fetchTaskRecent = useCallback(() => {
    if (!checkQueryCondition()) {
      return
    }
    const queryScope =
      showScope === "my"
        ? { user: [user ? user.id : ""] }
        : showScope === "public"
        ? { user: [groupId] }
        : {
            project: sharedProjects.length
              ? sharedProjects.map((r) => r.id)
              : ["none"],
          }
    getTasksAllEx({
      page: 0,
      page_size: 5,
      order_by: ["-last_update"],
      status: [
        "published",
        "closed",
        "failed",
        "stopped",
        "in_progress",
        "completed",
      ],
      ...queryScope,
      type: [
        "__$not",
        "annotation_manual",
        "__$not",
        "annotation",
        "__$not",
        "dataset_import",
      ],
      only_fields: [
        "type",
        "status",
        "created",
        "name",
        "id",
        "last_update",
        "started",
        "project.name",
      ],
      allow_public: false,
    }).then(({ data, meta }) => {
      if (meta.result_code !== 200) {
        message.error(meta.result_msg)
        return
      }
      setTasks(data.tasks ?? [])
    })
  }, [user, groupId, showScope, sharedProjects])

  useEffect(() => {
    fetchRecentProjects()
    fetchTaskRecent()
  }, [])

  useEffect(() => {
    fetchRecentProjects()
    fetchTaskRecent()
  }, [orderBy, sortOrder, groupId, showScope, sharedProjects])

  return (
    <div className={styles.dashboardBody}>
      <ProjectNewDialog
        show={newProjDialog}
        onClose={(e) => {
          setNewProjDialog(false)
          e && fetchRecentProjects()
        }}
      />
      <div className={styles.recent}>
        <div className={styles.recentProject}>
          <div className={styles.recentHeader} ref={ref}>
            <div className={styles.recentTitle}>
              RECENT PROJECTS
              <Link to={"/projects"}>VIEW ALL</Link>
              <ProjectListHeader />
            </div>
            <div>
              {projects.length > 3 && (
                <Button
                  icon={<i className="al-icon al-ico-add" />}
                  onClick={() => setNewProjDialog(true)}
                >
                  NEW PROJECT
                </Button>
              )}
            </div>
          </div>
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() =>
                navigate(`/projects/${p.id}/experiments`, {
                  state: { target: "experiments" },
                })
              }
            >
              <ProjectCard project={p} />
            </div>
          ))}
          {projects.length < 4 && showScope === "my" && (
            <div onClick={() => setNewProjDialog(true)}>
              <ProjectCard showAdd={true} />
            </div>
          )}
        </div>
        <div
          className={styles.recentExperiment}
          style={{
            width: ref.current?.getBoundingClientRect().width ?? "auto",
          }}
        >
          <div className={styles.recentHeader}>
            <div className={styles.recentTitle}>RECENT EXPERIMENTS</div>
            <div>
              <Button
                icon={<i className="al-icon al-ico-queues" />}
                size={"middle"}
              >
                <Link to={"/workers-and-queues/workers"}>
                  MANAGE WORKERS AND QUEUES
                </Link>
              </Button>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <Table
              dataSource={tasks}
              rowKey="id"
              pagination={false}
              size="middle"
            >
              <Column
                dataIndex="type"
                title="TYPE"
                render={(type) => (
                  <TaskIconLabel type={type} showLabel iconClass="md" />
                )}
              />
              <Column
                dataIndex="name"
                title="TITLE"
                render={(name) => (
                  <Typography.Text
                    ellipsis={{
                      tooltip: {
                        color: "blue",
                        title: name,
                        placement: "bottom",
                      },
                    }}
                    style={{ maxWidth: 450 }}
                  >
                    {name}
                  </Typography.Text>
                )}
              />
              <Column
                dataIndex={["project", "name"]}
                title="PROJECT"
                render={(name) => (
                  <Tooltip title={name} color={"blue"}>
                    <div className="ellipsis" style={{ maxWidth: 450 }}>
                      {name}
                    </div>
                  </Tooltip>
                )}
              />
              <Column
                dataIndex="started"
                title="STARTED"
                render={(started) =>
                  dayjs(started).format("YYYY-MM-DD HH:mm:ss")
                }
              />
              <Column
                dataIndex="last_update"
                title="UPDATED"
                render={(last_update) =>
                  dayjs(last_update).format("YYYY-MM-DD HH:mm:ss")
                }
              />
              <Column
                dataIndex="status"
                title="STATUS"
                render={(status) => (
                  <TaskStatusLabel status={status} showLabel showIcon />
                )}
              />
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
