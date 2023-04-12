import { useParams } from "react-router-dom"
import styles from "./index.module.scss"
import { useCallback, useEffect, useState } from "react"
import classNames from "classnames"
import { TASKS_STATUS_LABELS, TaskStatusEnum } from "@/types/enums"
import { tasksGetByIdEx } from "@/api/task"
import { TASK_INFO_ONLY_FIELDS_BASE } from "@/views/projects/experiments/columnsLib"
import { Task } from "@/types/task"

export const ExperimentDetails = (props: { children: JSX.Element }) => {
  const params = useParams()
  const { children } = props
  const [curTask, setCurTask] = useState<Task>()

  const getTaskInfo = useCallback(() => {
    tasksGetByIdEx({
      id: [params["expId"] ?? ""],
      only_fields: TASK_INFO_ONLY_FIELDS_BASE,
    }).then(({ data, meta }) => {
      if (data.tasks?.length) {
        setCurTask(data.tasks[0])
      }
    })
  }, [params])

  useEffect(() => {
    getTaskInfo()
  }, [getTaskInfo, params])

  return (
    <div className={styles.experimentInfo}>
      <div
        className={classNames(
          styles.statusLine,
          styles[curTask?.status ?? TaskStatusEnum.Unknown],
        )}
      >
        <span className={styles.labelWrap}>
          <span className={styles.label}>
            {TASKS_STATUS_LABELS[curTask?.status ?? TaskStatusEnum.Unknown]}
          </span>
        </span>
      </div>
      Experiment:{params["expId"]}
      {children}
    </div>
  )
}
