import { Outlet, useParams } from "react-router-dom";
import { ProjectList } from "@/views/projects/list";

const Projects = () => {
  const params = useParams();
  return (
    <>
      {params["projId"] && <Outlet />}
      {!params["projId"] && <ProjectList />}
    </>
  );
};

export default Projects;
