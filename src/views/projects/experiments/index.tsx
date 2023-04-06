import {
  Button,
  Checkbox,
  message,
  Popover,
  Radio,
  Space,
  Table,
  TableProps,
} from "antd"
import {
  colsSelectableMap,
  ColumnDefine,
  getExperimentTableCols,
} from "./columnFilterLibs"
import React, { Key, useCallback, useEffect, useRef, useState } from "react"
import { FilterMap, Task } from "@/types/task"
import { getGetAllQuery, getTasksAllEx } from "@/api/task"
import { useStoreSelector, useThunkDispatch } from "@/store"
import {
  MoreOutlined,
  PlusOutlined,
  SettingFilled,
  TableOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons"
import styles from "./index.module.scss"
import { ColumnFilterItem } from "antd/es/table/interface"
import { flatten, get, map } from "lodash"
import { SortMeta } from "@/types/common"
import { hasValue } from "@/utils/global"
import classNames from "classnames"
import { setTableColumn } from "@/store/experiment/experiment.actions"
import { CheckboxValueType } from "antd/es/checkbox/Group"
import { uploadUserPreference } from "@/store/app/app.actions"
import { NewExperimentDialog } from "@/views/projects/experiments/dialog/NewExperimentDialog"
import { AUTO_REFRESH_INTERVAL } from "@/utils/constant"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { ReactComponent as Split } from "@/assets/icons/split.svg"
import { ExperimentList } from "@/views/projects/experiments/ExperimentList"
import { Outlet, useNavigate, useParams } from "react-router-dom"

export const Experiments = () => {
  const selectedProject = useStoreSelector(
    (state) => state.project.selectedProject,
  )
  const userViewsConf = useStoreSelector((state) => state.app.preferences.views)
  const cols = useStoreSelector((state) => state.experiment.cols)
  const navigate = useNavigate()
  const params = useParams()

  const [showCols, setShowCols] = useState<ColumnDefine<Task>[]>(
    getExperimentTableCols(cols),
  )
  const [scrollId, setScrollId] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [filteredInfo, setFilteredInfo] = useState<FilterMap>({})
  const [sorter, setSorter] = useState<SortMeta | undefined>({
    order: -1,
    field: "last_update",
  })
  const [selectExpKeys, setSelectExpKeys] = useState<Key[]>([])
  const [showArchive, setShowArchive] = useState(false)
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [viewState, setViewState] = useState(params["expId"] ? "list" : "table")
  const [oneTimeAni, setOneTimeAni] = useState(false)

  const dispatch = useThunkDispatch()

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
    (reload: boolean, allowRefresh: boolean) => {
      if (!scrollId && allowRefresh) {
        return
      }
      if (reload) {
        setSelectExpKeys([])
      }
      const request = getGetAllQuery({
        refreshScroll: allowRefresh && !!scrollId && userViewsConf?.autoRefresh,
        scrollId: !allowRefresh && reload ? null : scrollId,
        projectId: selectedProject?.id ?? "",
        archived: showArchive,
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
      userViewsConf,
      showArchive,
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
    fetchDataRef.current(true, false)
  }, [])

  useEffect(() => {
    if (selectedProject?.id) {
      fetchDataRef.current(true, false)
    }
  }, [showArchive, filteredInfo, sorter, selectedProject?.id, showCols.length])

  useEffect(() => {
    setShowCols(() =>
      showCols.map((col) => {
        col.filteredValue = filteredInfo[col.dataIndex]?.value || null
        return col
      }),
    )
  }, [filteredInfo, sorter])

  useEffect(() => {
    let clearTimer: NodeJS.Timer | null = null
    if (userViewsConf?.autoRefresh) {
      clearTimer = setInterval(() => {
        if (!!scrollId) fetchDataRef.current(true, true)
      }, AUTO_REFRESH_INTERVAL)
    }
    return () => {
      if (clearTimer) {
        clearInterval(clearTimer)
      }
    }
  }, [scrollId, userViewsConf])

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

  function changeShowCols(e: CheckboxValueType[]) {
    const colIndex = e.map((e) => e.toString())
    const oldCols = showCols.filter((c) => colIndex.includes(c.dataIndex))
    const newCols = getExperimentTableCols(colIndex)
    setShowCols([
      ...oldCols,
      ...newCols.filter(
        (v) => !oldCols.some((c) => v.dataIndex === c.dataIndex),
      ),
    ])
    dispatch(setTableColumn(colIndex))
  }

  function setView(view: string) {
    setViewState(view)
    if (view === "list") {
      setOneTimeAni(true)
      setTimeout(() => {
        setOneTimeAni(false)
      }, 1000)
      navigate(`${tasks[0].id}/info`)
    } else {
      navigate(`/projects/${params["projId"]}/experiments`)
    }
  }

  return (
    <div className={styles.experiments}>
      <NewExperimentDialog
        show={showNewDialog}
        onClose={() => setShowNewDialog(false)}
      />
      <Space className={styles.headerLeft}>
        <Button icon={<PlusOutlined />} onClick={() => setShowNewDialog(true)}>
          New Experiment
        </Button>
        <Button
          icon={
            <span className="anticon">
              <i
                className={
                  showArchive ? "al-ico-exit-archive" : "al-ico-archive"
                }
              />
            </span>
          }
          onClick={() => {
            setShowArchive(!showArchive)
            setSelectExpKeys([])
            setView("table")
          }}
        >
          {showArchive ? "Exit" : "Open"} Archive
        </Button>
        <Radio.Group
          disabled={showArchive}
          value={viewState}
          onChange={(e) => setView(e.target.value)}
          optionType="button"
          options={[
            {
              label: <TableOutlined />,
              value: "table",
            },
            {
              label: <UnorderedListOutlined />,
              value: "list",
            },
          ]}
        />
      </Space>
      <Space className={styles.headerRight}>
        {viewState === "table" && (
          <>
            <i
              className={classNames("al-icon al-ico-filter-reset", {
                disabled: !Object.values(filteredInfo).some(
                  (v) => v && v.value,
                ),
              })}
              onClick={() => setFilteredInfo({})}
            >
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
            <Popover
              trigger="click"
              content={
                <div>
                  <Checkbox.Group
                    style={{ display: "block" }}
                    value={cols}
                    onChange={(e) => changeShowCols(e)}
                  >
                    {map(colsSelectableMap, (v) => (
                      <li key={v.dataIndex}>
                        <Checkbox value={v.dataIndex}>{v.title}</Checkbox>
                      </li>
                    ))}
                  </Checkbox.Group>
                </div>
              }
            >
              <Button type="text" icon={<SettingFilled />} />
            </Popover>
          </>
        )}
        <i
          className={classNames("al-icon", {
            "al-ico-auto-refresh-play": userViewsConf?.autoRefresh,
            "al-ico-auto-refresh-pause": !userViewsConf?.autoRefresh,
          })}
          onClick={() =>
            dispatch(
              uploadUserPreference("views", {
                ...userViewsConf,
                autoRefresh: !userViewsConf?.autoRefresh,
              }),
            )
          }
        >
          <span className="path1"></span>
          <span className="path2"></span>
        </i>
      </Space>
      <PanelGroup direction="horizontal">
        <Panel
          defaultSize={viewState === "table" ? 100 : 30}
          className={classNames(styles.experimentTable, {
            [styles.activeList]: oneTimeAni,
          })}
        >
          {viewState === "table" ? (
            <div style={{ width: "max-content" }}>
              <Table
                rowKey={"id"}
                className={styles.taskTable}
                size="small"
                pagination={false}
                scroll={{ x: "max-content" }}
                rowSelection={{
                  selectedRowKeys: selectExpKeys,
                  onChange: (selectedRowKeys: Key[]) => {
                    setSelectExpKeys(selectedRowKeys)
                  },
                }}
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
            </div>
          ) : (
            <ExperimentList
              tasks={tasks}
              selectedKeys={selectExpKeys}
              setSelectedKeys={setSelectExpKeys}
            />
          )}
          {hasMore && !!scrollId && (
            <div className={styles.loadMore}>
              <Button onClick={() => fetchExperiments(false, false)}>
                Load More
              </Button>
            </div>
          )}
        </Panel>
        {viewState === "list" && (
          <>
            <PanelResizeHandle className={styles.splitBar}>
              <Split />
            </PanelResizeHandle>
            <Panel collapsible className={styles.experimentInfo}>
              Continue developing
              <Outlet />
            </Panel>
          </>
        )}
      </PanelGroup>
    </div>
  )
}
