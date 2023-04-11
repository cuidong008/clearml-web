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
  MoreOutlined,
  PlusOutlined,
  SettingFilled,
  TableOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons"
import classNames from "classnames"
import styles from "./index.module.scss"
import {
  colsSelectableMap,
  ColumnDefine,
  getTasksTableCols,
} from "./columnFilterLibs"
import { Key, useCallback, useEffect, useRef, useState } from "react"
import { FilterMap, SelectedTask, Task } from "@/types/task"
import { SortMeta } from "@/types/common"
import { ColumnFilterItem } from "antd/es/table/interface"
import { CheckboxValueType } from "antd/es/checkbox/Group"
import { getGetAllQuery, getTasksAllEx } from "@/api/task"
import { useStoreSelector, useThunkDispatch } from "@/store"
import { setTableColumn } from "@/store/task/task.actions"
import { uploadUserPreference } from "@/store/app/app.actions"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import { flatten, get, map } from "lodash"
import { hasValue } from "@/utils/global"
import { AUTO_REFRESH_INTERVAL } from "@/utils/constant"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { ReactComponent as Split } from "@/assets/icons/split.svg"
import { ExperimentList } from "./ExperimentList"
import { ExperimentMenu } from "./menu"
import { ExperimentDetails } from "./details"
import { NewExperimentDialog } from "./dialog/NewExperimentDialog"
import { MenuContext, MenuCtx } from "@/views/projects/experiments/MenuCtx"

export const Experiments = () => {
  const selectedProject = useStoreSelector(
    (state) => state.project.selectedProject,
  )
  const userViewsConf = useStoreSelector((state) => state.app.preferences.views)
  const cols = useStoreSelector((state) => state.task.cols)
  const navigate = useNavigate()
  const params = useParams()

  const [loading, setLoading] = useState(false)
  const [showCols, setShowCols] = useState<ColumnDefine<Task>[]>(
    getTasksTableCols(cols),
  )
  const [scrollId, setScrollId] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [filteredInfo, setFilteredInfo] = useState<FilterMap>({})
  const [sorter, setSorter] = useState<SortMeta | undefined>({
    order: -1,
    field: "last_update",
  })
  const [selectedTask, setSelectedTask] = useState<SelectedTask>({
    rows: [],
    keys: [],
  })
  const [showArchive, setShowArchive] = useState(false)
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [viewState, setViewState] = useState(params["expId"] ? "list" : "table")
  const [oneTimeAni, setOneTimeAni] = useState(false)
  const [ctxMenu, setCtxMenu] = useState<MenuCtx>({
    x: 0,
    y: 0,
    showMenu: false,
    showFooter: false,
    target: undefined,
    selectedTasks: [],
    ctxMode: "single",
    isArchive: false,
  })
  const [fullView, setFullView] = useState(false)
  const [msg, msgContext] = message.useMessage()
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

  const fetchTasks = useCallback(
    (reload: boolean, allowRefresh: boolean) => {
      if (!scrollId && allowRefresh) {
        return
      }
      if (reload) {
        setSelectedTask({ rows: [], keys: [] })
      }
      if (!allowRefresh) {
        setLoading(true)
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
      getTasksAllEx(request)
        .then(({ data, meta }) => {
          if (meta.result_code !== 200) {
            msg.error(meta.result_msg)
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
        .catch(() => {
          msg.error("get experiments failure")
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [
      loading,
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
  const fetchDataRef = useRef(fetchTasks)

  useEffect(() => {
    // watch url path change when browser back or forward
    if (!params["expId"]) {
      setViewState(() => "table")
    } else {
      setViewState(() => "list")
      if (params["output"] === "full") {
        setFullView(() => true)
      } else {
        setFullView(() => false)
      }
    }
  }, [params])

  useEffect(() => {
    fetchDataRef.current = fetchTasks
  }, [fetchTasks])

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

  useEffect(() => {
    function close(e: Event) {
      const id = (e.target as HTMLInputElement).id
      if (id === "expCtxMenu") {
        return
      }
      setCtxMenu({ ...ctxMenu, x: 0, y: 0, showMenu: false })
    }

    if (ctxMenu.showMenu) {
      document.addEventListener("click", close)
    }
    return () => {
      document.removeEventListener("click", close)
    }
  }, [ctxMenu])

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
    const newCols = getTasksTableCols(colIndex)
    setShowCols([
      ...oldCols,
      ...newCols.filter(
        (v) => !oldCols.some((c) => v.dataIndex === c.dataIndex),
      ),
    ])
    dispatch(setTableColumn(colIndex))
  }

  function setView(view: string, task?: Task) {
    setViewState(view)
    if (view === "list") {
      setOneTimeAni(true)
      setTimeout(() => {
        setOneTimeAni(false)
      }, 1000)
      if (task) {
        navigate(`${task.id}/details`)
      } else {
        navigate(`${tasks[0].id}/details`)
      }
    } else {
      navigate(`/projects/${params["projId"]}/experiments`)
    }
  }

  function taskClick(e: Task, nav: boolean) {
    setSelectedTask({ keys: [e.id], rows: [e] })
    if (nav) {
      setView("list", e)
    }
  }

  function handleContext(x: number, y: number, e: Task, needSelected: boolean) {
    let ctx: MenuCtx = {
      ...ctxMenu,
      x,
      y,
      showMenu: true,
      target: e,
      ctxMode: "single",
      selectedTasks: selectedTask.rows,
    }
    if (needSelected) {
      if (!selectedTask.keys.includes(e.id)) {
        setSelectedTask({ keys: [e.id], rows: [e] })
        ctx = {
          ...ctx,
          ctxMode: "multi",
          selectedTasks: [e],
        }
      } else {
        ctx = {
          ...ctx,
          ctxMode: "multi",
        }
      }
    }
    setCtxMenu(() => ctx)
  }

  function dispatchCtxMenuAct(e: string, t?: Task) {
    switch (e) {
      case "detail":
        setView("list", t)
        break
      case "refresh":
        fetchTasks(true, false)
        break
    }
  }

  return (
    <div
      className={styles.experiments}
      style={{
        height: `calc(100% - ${selectedTask.keys.length > 1 ? 105 : 55}px)`,
      }}
    >
      {msgContext}
      <NewExperimentDialog
        show={showNewDialog}
        onClose={() => setShowNewDialog(false)}
      />
      {!fullView && (
        <>
          <Space className={styles.headerLeft}>
            <Button
              icon={<PlusOutlined />}
              onClick={() => setShowNewDialog(true)}
            >
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
                setCtxMenu({ ...ctxMenu, isArchive: !showArchive })
                setSelectedTask({ keys: [], rows: [] })
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
                  disabled: tasks.length === 0 || showArchive,
                },
              ]}
            />
          </Space>
          <Space className={styles.headerRight}>
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
            {viewState === "table" && (
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
            )}
            <i
              className={classNames(
                "al-icon",
                userViewsConf?.autoRefresh
                  ? "al-ico-auto-refresh-play"
                  : "al-ico-auto-refresh-pause",
              )}
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
                    loading={loading}
                    rowKey={"id"}
                    className={styles.taskTable}
                    size="small"
                    showSorterTooltip={false}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    onRow={(record) => ({
                      onClick: () => taskClick(record, false),
                      onDoubleClick: () => taskClick(record, true),
                      onContextMenu: (e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        const { clientX, clientY } = e
                        handleContext(clientX, clientY, record, true)
                      },
                    })}
                    rowSelection={{
                      selectedRowKeys: selectedTask.keys,
                      onChange: (
                        selectedRowKeys: Key[],
                        selectedRows: Task[],
                      ) => {
                        setSelectedTask({
                          keys: selectedRowKeys,
                          rows: selectedRows,
                        })
                        setCtxMenu({
                          ...ctxMenu,
                          selectedTasks: selectedRows,
                          showMenu: selectedRowKeys.includes(
                            ctxMenu.target?.id ?? "",
                          )
                            ? ctxMenu.showMenu
                            : false,
                          target: selectedRowKeys.includes(
                            ctxMenu.target?.id ?? "",
                          )
                            ? ctxMenu.target
                            : undefined,
                        })
                      },
                    }}
                    columns={showCols.concat([
                      {
                        dataIndex: "id",
                        title: "",
                        getter: [],
                        fixed: "right",
                        render: (_, record) => (
                          <Button
                            icon={<MoreOutlined />}
                            onClick={(e) => {
                              e.stopPropagation()
                              const { clientX, clientY } = e
                              handleContext(
                                clientX - 220,
                                clientY,
                                record,
                                false,
                              )
                            }}
                          />
                        ),
                      },
                    ])}
                    dataSource={tasks}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <ExperimentList
                  tasks={tasks}
                  selectedKeys={selectedTask}
                  setSelectedKeys={(e) => {
                    setSelectedTask(e)
                    setCtxMenu({
                      ...ctxMenu,
                      selectedTasks: e.rows,
                      showMenu: e.keys.includes(ctxMenu.target?.id ?? "")
                        ? ctxMenu.showMenu
                        : false,
                      target: e.keys.includes(ctxMenu.target?.id ?? "")
                        ? ctxMenu.target
                        : undefined,
                    })
                  }}
                  sorter={sorter}
                  setSorter={setSorter}
                  onCtx={handleContext}
                />
              )}
              {hasMore && !!scrollId && (
                <div className={styles.loadMore}>
                  <Button onClick={() => fetchTasks(false, false)}>
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
                <Panel collapsible>
                  <ExperimentDetails>
                    <Outlet />
                  </ExperimentDetails>
                </Panel>
              </>
            )}
          </PanelGroup>
        </>
      )}
      {fullView && (
        <ExperimentDetails>
          <Outlet />
        </ExperimentDetails>
      )}
      <MenuContext.Provider value={ctxMenu}>
        <ExperimentMenu dispatch={dispatchCtxMenuAct} />
      </MenuContext.Provider>
    </div>
  )
}
