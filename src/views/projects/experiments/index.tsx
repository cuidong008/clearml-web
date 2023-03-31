import { Button, message, Table, TableProps } from "antd"
import {
  colsSelectableMap,
  ColumnDefine,
  DEFAULT_COLS,
  getExperimentTableCols,
} from "./columnFilterLibs"
import { useCallback, useEffect, useRef, useState } from "react"
import { FilterMap, Task } from "@/types/task"
import { getGetAllQuery, getTasksAllEx } from "@/api/task"
import { useStoreSelector } from "@/store"
import { MoreOutlined } from "@ant-design/icons"
import styles from "./index.module.scss"
import { ColumnFilterItem } from "antd/es/table/interface"
import { flatten, get, map } from "lodash"
import { SortMeta } from "@/types/common"
import { hasValue } from "@/utils/global"

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
  const [filteredInfo, setFilteredInfo] = useState<FilterMap>({})
  const [sorter, setSorter] = useState<SortMeta | undefined>({
    order: -1,
    field: "last_update",
  })

  const injectColsFilters = useCallback(
    (tasks: Task[]) => {
      showCols.forEach((col) => {
        if (col.filterable) {
          const values: (string | number)[] = []
          const labels: string[] = []
          tasks.forEach((t) => {
            const val = col.valuePath ? get(t, col.valuePath) : t[col.dataIndex]
            const label = col.labelPath ? get(t, col.labelPath) : val
            if (hasValue(val) && label) {
              values.push(val)
              labels.push(label)
            }
          })
          const filterValues = [...new Set(flatten(values))]
          const filterTexts = [...new Set(flatten(labels))]
          const newFilter = filterValues
            .map<ColumnFilterItem>((v: string | number, i) => ({
              text: ["user", "tags"].includes(col.dataIndex)
                ? filterTexts[i]
                : filterTexts[i].toString().toUpperCase(),
              value: v,
            }))
            .filter((f) => !col.filters?.some((i) => i.value === f.value))
          col.filters = [...(col.filters ?? []), ...newFilter]
        }
        col.filteredValue = filteredInfo[col.dataIndex]?.value || null
      })
    },
    [showCols, filteredInfo],
  )

  const fetchExperiments = useCallback(
    (reload: boolean) => {
      const request = getGetAllQuery({
        refreshScroll: false,
        scrollId: reload ? null : scrollId,
        projectId: selectedProject?.id ?? "",
        archived: false,
        orderFields: sorter ? [sorter] : [],
        isCompare: false,
        pageSize: 15,
        cols: showCols,
        filters: filteredInfo,
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
    [
      sorter,
      tasks,
      filteredInfo,
      selectedProject,
      scrollId,
      showCols,
      injectColsFilters,
    ],
  )
  const fetchDataRef = useRef(fetchExperiments)

  useEffect(() => {
    fetchDataRef.current = fetchExperiments
  }, [fetchExperiments])

  useEffect(() => {
    fetchDataRef.current(true)
  }, [])

  useEffect(() => {
    if (selectedProject?.id) {
      fetchDataRef.current(true)
    }
  }, [filteredInfo, sorter, selectedProject?.id, showCols.length])

  const handleChange: TableProps<Task>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    const filterMap: FilterMap = {}
    map(filters, (f, r) => {
      const col = colsSelectableMap[r.toUpperCase()]
      filterMap[r] = { value: f, path: col.valuePath ?? col.dataIndex }
    })
    setFilteredInfo(filterMap)
    setShowCols(() =>
      showCols.map((col) => {
        col.filteredValue = filterMap[col.dataIndex]?.value || null
        return col
      }),
    )
    if (!(sorter instanceof Array)) {
      setSorter(
        sorter && sorter.field && sorter.order
          ? {
              field:
                sorter.field instanceof Array
                  ? sorter?.field[0].toString()
                  : sorter.field.toString(),
              order: sorter.order === "descend" ? -1 : 1,
            }
          : undefined,
      )
    }
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
