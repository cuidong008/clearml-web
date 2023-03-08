import { ProjectCard } from "@/components/ProjectCard";
import { useEffect, useRef, useState } from "react";
import { Project } from "@/types/project";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";
import { Button, Table } from "antd";
import { getAllProjects } from "@/api/project";

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProjectList();
  }, []);

  function getProjectList() {
    getAllProjects({
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
              <Button icon={<i className="al-icon al-ico-add" />}>
                NEW PROJECT
              </Button>
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
            <Table></Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
