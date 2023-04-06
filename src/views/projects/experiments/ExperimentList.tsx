import { Button, Card, Checkbox, Dropdown, List, MenuProps } from "antd"
import { Task } from "@/types/task"
import styles from "./index.module.scss"
import { TaskStatusLabel } from "@/components/TaskStatusLabel"
import { TaskIconLabel } from "@/components/TaskIconLabel"
import { TaskTypeEnum } from "@/types/enums"
import { TagList } from "@/components/TagList"
import { transformDateToPeriod } from "@/utils/transformer"
import { CaretDownOutlined } from "@ant-design/icons"
import { Dispatch, Key, SetStateAction, useEffect, useState } from "react"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import classNames from "classnames"

export const ExperimentList = (props: {
  tasks: Task[]
  selectedKeys: Key[]
  setSelectedKeys: Dispatch<SetStateAction<Key[]>>
}) => {
  const { tasks, selectedKeys, setSelectedKeys } = props
  const items: MenuProps["items"] = []
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(false)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (selectedKeys.length) {
      setIndeterminate(true)
      if (selectedKeys.length === tasks.length) {
        setIndeterminate(false)
        setCheckAll(true)
      }
    } else {
      setIndeterminate(false)
      setCheckAll(false)
    }
  }, [selectedKeys])

  function handleChecked(e: CheckboxChangeEvent) {
    const id = e.target.value
    const isCheck = e.target.checked
    let selected: Key[] = []
    if (isCheck) {
      selected = [...new Set([...selectedKeys, id])]
    } else {
      selected = selectedKeys.filter((v) => v !== id)
    }
    setSelectedKeys(selected)
  }

  function handleGlobalCheck(e: CheckboxChangeEvent) {
    if (e.target.checked) {
      setSelectedKeys(tasks.map((t) => t.id))
    } else {
      setSelectedKeys([])
    }
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }

  function setExperimentShow(id: string) {
    if (params["expId"]) {
      navigate(location.pathname.replace(params["expId"], id))
    }
  }

  return (
    <div className={styles.cardList}>
      <div className={styles.listHeader}>
        <Checkbox
          indeterminate={indeterminate}
          checked={checkAll}
          onChange={handleGlobalCheck}
        />
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
          <List.Item key={item.id} title={item.name}>
            <Card
              className={classNames(styles.card, {
                [styles.selected]: params["expId"] === item.id,
              })}
              onClick={() => setExperimentShow(item.id)}
            >
              <Checkbox
                className="tkCbx"
                value={item.id}
                checked={selectedKeys.includes(item.id)}
                onChange={handleChecked}
              />
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
