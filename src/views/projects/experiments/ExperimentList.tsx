import { Button, Card, Checkbox, Dropdown, List } from "antd"
import { SelectedTask, Task } from "@/types/task"
import { SortMeta } from "@/types/common"
import { ItemType } from "antd/es/menu/hooks/useItems"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import {
  Dispatch,
  Key,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react"
import styles from "./index.module.scss"
import classNames from "classnames"
import { TaskStatusLabel } from "@/components/TaskStatusLabel"
import { TaskIconLabel } from "@/components/TaskIconLabel"
import { TaskTypeEnum } from "@/types/enums"
import { TagList } from "@/components/TagList"
import { transformDateToPeriod } from "@/utils/transformer"
import { CaretDownOutlined } from "@ant-design/icons"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { colsSelectableMap } from "./columnFilterLibs"
import { map } from "lodash"

export const ExperimentList = (props: {
  tasks: Task[]
  selectedKeys: SelectedTask
  setSelectedKeys: (e: SelectedTask) => void
  sorter: SortMeta | undefined
  setSorter: Dispatch<SetStateAction<SortMeta | undefined>>
  onCtx: (x: number, y: number, e: Task, selected: boolean) => void
}) => {
  const { tasks, selectedKeys, setSelectedKeys, sorter, setSorter, onCtx } =
    props

  function reverseOrder(e: MouseEvent<HTMLElement>) {
    e.stopPropagation()
    if (sorter) {
      setSorter({ ...sorter, order: -sorter.order })
    }
  }

  function selectSort({ key }: { key: string }) {
    setSorter({ field: key, order: 1 })
  }

  const items: ItemType[] = map(colsSelectableMap, (v) => {
    if (v.sorter) {
      return {
        key: v.dataIndex,
        label: (
          <div className={styles.filterItem}>
            {v.title}
            {sorter?.field === v.dataIndex && (
              <i
                onClick={(e) => reverseOrder(e)}
                className={classNames("al-icon", {
                  "al-ico-sort-asc": sorter.order === 1,
                  "al-ico-sort-desc": sorter.order === -1,
                })}
              />
            )}
          </div>
        ),
      }
    }
    return null
  }).filter((v) => !!v)
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(false)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (selectedKeys.keys.length) {
      setIndeterminate(true)
      if (selectedKeys.keys.length === tasks.length) {
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
    let selected: Key[]
    if (isCheck) {
      selected = [...new Set([...selectedKeys.keys, id])]
    } else {
      selected = selectedKeys.keys.filter((v) => v !== id)
    }
    const selectedTask = tasks.filter((t) => selected.includes(t.id))
    setSelectedKeys({ keys: selected, rows: selectedTask })
  }

  function handleGlobalCheck(e: CheckboxChangeEvent) {
    if (e.target.checked) {
      setSelectedKeys({ keys: tasks.map((t) => t.id), rows: tasks })
    } else {
      setSelectedKeys({ keys: [], rows: [] })
    }
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }

  function setTaskToShow(id: string) {
    if (params["expId"] && params["expId"] !== id) {
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
        <Dropdown trigger={["click"]} menu={{ items, onClick: selectSort }}>
          <Button size="small" type="ghost">
            SORTED BY
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
              onClick={() => setTaskToShow(item.id)}
              onContextMenu={(e) => {
                e.stopPropagation()
                e.preventDefault()
                const { clientX, clientY } = e
                onCtx(clientX, clientY, item, false)
              }}
            >
              <Checkbox
                className="tkCbx"
                value={item.id}
                checked={selectedKeys.keys.includes(item.id)}
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
                  status={item.status ?? "unknown"}
                  showIcon
                  showLabel
                />
              </div>
              <div className="tkTags">
                <TagList sysTags={item.system_tags} tags={item.tags ?? []} />
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
