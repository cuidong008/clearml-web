import { Button, Card, Checkbox, Dropdown, List, MenuProps } from "antd"
import { Task } from "@/types/task"
import styles from "./index.module.scss"
import { TaskStatusLabel } from "@/components/TaskStatusLabel"
import { TaskIconLabel } from "@/components/TaskIconLabel"
import { TaskTypeEnum } from "@/types/enums"
import { TagList } from "@/components/TagList"
import { transformDateToPeriod } from "@/utils/transformer"
import { CaretDownOutlined } from "@ant-design/icons"

export const ExperimentList = (props: { tasks: Task[] }) => {
  const { tasks } = props
  const items: MenuProps["items"] = []
  return (
    <div className={styles.cardList}>
      <div className={styles.listHeader}>
        <Checkbox />
        <div className={styles.title}>EXPERIMENT LIST</div>
        <Dropdown menu={{ items }}>
          <Button type="ghost">
            Sort By
            <CaretDownOutlined />
          </Button>
        </Dropdown>
      </div>
      <List
        size="small"
        dataSource={tasks}
        renderItem={(item) => (
          <List.Item title={item.name}>
            <Card className={styles.card}>
              <Checkbox className="tkCbx" />
              <div className="tkType">
                <TaskIconLabel
                  iconClass="md"
                  type={item.type ?? TaskTypeEnum.Custom}
                />
              </div>
              <div className="tkName">
                <div className={styles.name}>
                  <span>{item.name}</span>
                </div>
                <TaskStatusLabel
                  className={styles.status}
                  status={item.status ?? ""}
                  showIcon
                  showLabel
                />
              </div>
              <div className="tkTags">
                <TagList tags={item.tags ?? []} />
              </div>
              <div className="tkData">
                <div className={styles.name}>
                  <span>
                    Updated {transformDateToPeriod(item.last_update)}
                    <span className={styles.dot}>●</span>Created by{" "}
                    {item.user?.name ?? "Unknown"}
                  </span>
                </div>
                {!!item.last_iteration && (
                  <span>{`${item.last_iteration} Iterations`}</span>
                )}
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  )
}
