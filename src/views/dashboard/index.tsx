import { ProjectCard } from "@/components/ProjectCard";
import { useEffect, useRef, useState } from "react";
import { Project } from "@/types/project";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";
import { Button, Table, Tooltip } from "antd";
import { getAllProjectsEx } from "@/api/project";
import Column from "antd/es/table/Column";
import { getAllTasksEx } from "@/api/task";
import { Task } from "@/types/task";
import { TaskIconLabel } from "@/views/projects/TaskIconLabel";
import { TaskStatusLabel } from "@/views/projects/TaskStatusLabel";
import dayjs from "dayjs";

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProjectList();
    getRecentTasks();
  }, []);

  function getProjectList() {
    getAllProjectsEx({
      stats_for_state: "active",
      include_stats: true,
      check_own_contents: true,
      order_by: ["featured", "-last_update"],
      page: 0,
      page_size: 6,
      include_stats_filter: { system_tags: ["-pipeline"] },
      allow_public: false,
      only_fields: [
        "name",
        "company",
        "user",
        "created",
        "default_output_destination",
      ],
    }).then(({ data }) => {
      setProjects(data.projects ?? []);
    });
  }

  function getRecentTasks() {
    getAllTasksEx({
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
      system_tags: ["-archived", "-pipeline"],
      allow_public: false,
    }).then(({ data }) => {
      setTasks(data.tasks ?? []);
    });
  }

  return (
    <div className={styles.dashboardBody}>
      <div className={styles.recent}>
        <div className={styles.recentProject}>
          <div className={styles.recentHeader} ref={ref}>
            <div className={styles.recentTitle}>
              RECENT PROJECTS
              <Link to={"/projects"}>VIEW ALL</Link>
            </div>
            <div>
              {projects.length > 3 && (
                <Button icon={<i className="al-icon al-ico-add" />}>
                  NEW PROJECT
                </Button>
              )}
            </div>
          </div>
          {projects.map((p) => (
            <div key={p.id}>
              <ProjectCard project={p} />
            </div>
          ))}
          {projects.length < 4 && <ProjectCard showAdd={true} />}
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
              <Button icon={<i className="al-icon al-ico-queues" />}>
                MANAGE WORKERS AND QUEUES
              </Button>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <Table dataSource={tasks} rowKey="id" pagination={false}>
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
                  <Tooltip title={name} color={"blue"}>
                    <div className="ellipsis" style={{ maxWidth: 450 }}>
                      {name}
                    </div>
                  </Tooltip>
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
  );
};

export default Dashboard;
