import { useParams } from "react-router-dom"
import styles from "./index.module.scss"

export const ExperimentDetails = (props: { children: JSX.Element }) => {
  const params = useParams()
  const { children } = props
  return (
    <div className={styles.experimentInfo}>
      Experiment:{params["expId"]}
      {children}
    </div>
  )
}
