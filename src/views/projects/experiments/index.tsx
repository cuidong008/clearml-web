import { Button, message, Table, TableProps } from "antd"
import {
  ColumnDefine,
  DEFAULT_COLS,
  getExperimentTableCols,
} from "@/views/projects/experiments/tableColumns"
import { useCallback, useEffect, useState } from "react"
import { Task } from "@/types/task"
import { getGetAllQuery, getTasksAllEx } from "@/api/task"
import { useStoreSelector } from "@/store"
import { MoreOutlined } from "@ant-design/icons"
import styles from "./index.module.scss"
import { ColumnFilterItem } from "antd/es/table/interface"
import { debounce, flatten, get } from "lodash"

export const Experiments = () => {
  const selectedProject = useStoreSelector(
    (state) => state.project.selectedProject,
  )
  const [showCols, setShowCols] = useState<ColumnDefine<Task>[]>(
    getExperimentTableCols(DEFAULT_COLS),
  )
  const [scrollId, setScrollId] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [hasMore, setHasMore] = useState(false)

  const fetchExperiments = useCallback(
    (reload: boolean) => {
      const request = getGetAllQuery({
        refreshScroll: false,
        scrollId: reload ? null : scrollId,
        projectId: selectedProject?.id ?? "",
        archived: false,
        orderFields: [{ field: "last_update", order: -1 }],
        isCompare: false,
        pageSize: 15,
        cols: showCols,
      })
      getTasksAllEx(request).then(({ data, meta }) => {
        if (meta.result_code !== 200) {
          message.error(meta.result_msg)
          return
        }
        let taskList: Task[] = []
        if (reload) {
          taskList = [...data.tasks]
        } else {
          taskList = [...tasks, ...data.tasks]
        }
        setTasks(() => taskList)
        injectColsFilters(taskList)
        setHasMore(data.tasks.length >= 12)
        if (data.scroll_id && data.scroll_id !== scrollId) {
          setScrollId(data.scroll_id)
        }
      })
    },
    [selectedProject, scrollId, showCols, injectColsFilters],
  )

  useEffect(() => {
    if (selectedProject?.id) {
      fetchExperiments(true)
    }
  }, [fetchExperiments, selectedProject?.id, showCols.length])

  function handleFilter(
    col: ColumnDefine<Task>,
    value: string | number | boolean,
  ) {
    console.log(col, value)
  }

  const handleFilterDeb = debounce(handleFilter, 200)

  function injectColsFilters(tasks: Task[]) {
    showCols.forEach((col) => {
      if (col.filterable) {
        const values: (string | number)[] = tasks
          .map((t) => {
            return col.valuePath ? get(t, col.valuePath) : t[col.dataIndex]
          })
          .filter((v) => !!v)
        const filters = [...new Set(flatten(values))]
        col.filters = filters.map<ColumnFilterItem>((v: string | number) => ({
          text: v.toString().toUpperCase(),
          value: v,
        }))
        col.onFilter = (value) => {
          handleFilterDeb(col, value)
          return true
        }
      }
    })
  }

  const handleChange: TableProps<Task>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    console.log("Various parameters", pagination, filters, sorter)
  }

  return (
    <div style={{ overflow: "auto", height: "calc(100% - 70px)" }}>
      <div style={{ width: "max-content" }}>
        <Table
          rowKey={"id"}
          className={styles.taskTable}
          size="small"
          pagination={false}
          scroll={{ x: "max-content" }}
          rowSelection={{}}
          columns={showCols.concat([
            {
              dataIndex: "id",
              title: "",
              getter: [],
              fixed: "right",
              render: () => <Button icon={<MoreOutlined />} />,
            },
          ])}
          dataSource={tasks}
          onChange={handleChange}
        />
        {hasMore && !!scrollId && (
          <Button onClick={() => fetchExperiments(false)}>Load More</Button>
        )}
      </div>
    </div>
  )
}
