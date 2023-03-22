import { DkCard } from "@/components/DkCard"
import { Task } from "@/types/task"
import styles from "./index.module.scss"
import { CircleStatus } from "@/components/CircleStatus"
import { Button } from "antd"
import { CopyFilled } from "@ant-design/icons"
import classNames from "classnames"

export const ExperimentCard = (props: { experiment: Task }) => {
  const { experiment } = props

  return (
    <div className={styles.experimentCard}>
      <DkCard
        showFolder={false}
        height={264}
        cardHeader={
          <div className={styles.header}>
            <div className={styles.taskName}>
              <div className={styles.title}>{experiment?.name}</div>
            </div>
            <div style={{ paddingTop: 5 }}>
              <div className={styles.taskId}>
                <span className={styles.subTitle}>ID: {experiment?.id} </span>
                <Button size="small" type="text" icon={<CopyFilled />} />
              </div>
            </div>
          </div>
        }
        cardBody={
          <div className={styles.taskBody}>
            <CircleStatus type={experiment.type} />
            <CircleStatus status={experiment.status} />
          </div>
        }
        cardFooter={
          <div className={styles.taskFooter}>
            <div className={classNames("ellipsis", styles.topLabel)}>
              INITIAL INPUT MODEL:
              {experiment?.execution?.model}
            </div>
            <div
              className={classNames("ellipsis", styles.topLabel)}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>{`Created ${experiment?.created}`}</span>
              <span>{experiment?.user?.name}</span>
            </div>
          </div>
        }
      />
    </div>
  )
}
