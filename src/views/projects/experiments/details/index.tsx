import { useParams } from "react-router-dom"

export const ExperimentDetails = () => {
  const params = useParams()
  return <div>Experiment:{params["expId"]}</div>
}
