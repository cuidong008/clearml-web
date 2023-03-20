import { Outlet, useParams } from "react-router-dom";

const WorkerAndQueues = () => {
  const params = useParams();

  return (
    <div>
      <Outlet />
    </div>
  );
};
export default WorkerAndQueues;
