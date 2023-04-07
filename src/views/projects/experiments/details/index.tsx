import { useParams } from "react-router-dom"
import styles from "./index.module.scss"

export const ExperimentDetails = () => {
  const params = useParams()
  return (
    <div className={styles.experimentInfo}>Experiment:{params["expId"]}</div>
  )
}
