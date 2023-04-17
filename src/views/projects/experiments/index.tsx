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
import { colsSelectableMap, getTasksTableCols } from "./columnsLib"
import { Key, useCallback, useEffect, useRef, useState } from "react"
import { ColumnDefine, FilterMap, SelectedTask, Task } from "@/types/task"
import { SortMeta } from "@/types/common"
import { ColumnFilterItem } from "antd/es/table/interface"
import { CheckboxValueType } from "antd/es/checkbox/Group"
import { getGetAllQuery, getTasksAllEx } from "@/api/task"
import { useStoreSelector, useThunkDispatch } from "@/store"
import { setSelectedTask, setTableColumn } from "@/store/task/task.actions"
import { uploadUserPreference } from "@/store/app/app.actions"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import { cloneDeep, flatten, get, map } from "lodash"
import { hasValue } from "@/utils/global"
import { AUTO_REFRESH_INTERVAL } from "@/utils/constant"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { ReactComponent as Split } from "@/assets/icons/split.svg"
import { ExperimentList } from "./ExperimentList"
import { ExperimentMenu } from "./menu"
import { ExperimentDetails } from "./details"
import { NewExperimentDialog } from "./dialog/NewExperimentDialog"
import { MenuContext, MenuCtx } from "@/views/projects/experiments/menu/MenuCtx"

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
  const [selectedTasks, setSelectedTasks] = useState<SelectedTask>({
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
    target: undefined,
    selectedTasks: [],
    ctxMode: "single",
    isArchive: false,
    setCtx: (ctx) => {
      setCtxMenu(ctx)
    },
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
        setCtxMenu(() => ({
          ...ctxMenu,
          showMenu: false,
          showFooter: false,
          target: undefined,
          selectedTasks: [],
        }))
        setSelectedTasks({ rows: [], keys: [] })
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
        .then(({ data }) => {
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
      const id = (e.target as HTMLDivElement).id
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
        dispatch(setSelectedTask(task))
      } else {
        navigate(`${tasks[0].id}/details`)
        dispatch(setSelectedTask(tasks[0]))
      }
    } else {
      navigate(`/projects/${params["projId"]}/experiments`)
    }
  }

  function taskClick(e: Task, nav: boolean) {
    setSelectedTasks({ keys: [e.id], rows: [e] })
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
      selectedTasks: selectedTasks.rows,
    }
    if (needSelected) {
      if (!selectedTasks.keys.includes(e.id)) {
        setSelectedTasks({ keys: [e.id], rows: [e] })
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

  function dispatchCtxMenuAct(e: string, t?: Task[]) {
    switch (e) {
      case "detail":
        t && setView("list", t[0])
        break
      case "afterArchive":
        fetchTasks(true, false)
        if (viewState !== "table") {
          setView("table")
          setFullView(false)
        }
        break
      case "updateSelected":
        if (t && t.length === 1) {
          const selected = t[0]
          if (selected.id === params["expId"]) {
            dispatch(setSelectedTask(selected))
          }
          setTasks(() =>
            tasks.map((task) => {
              return task.id === selected.id ? selected : task
            }),
          )
          // update menu ctx selected tasks (bug when add new tag in detail
          // and footer menu add tag panel not update may cause duplicate tag update to task)
          if (ctxMenu.selectedTasks.some((v) => v.id === selected.id)) {
            setCtxMenu({
              ...ctxMenu,
              selectedTasks: ctxMenu.selectedTasks.map((v) =>
                v.id === selected.id ? selected : v,
              ),
            })
          }
        }
        break
      case "updateMany":
        if (t) {
          let tmpTasks = cloneDeep(tasks)
          t.forEach((v) => {
            if (v.id === params["expId"]) {
              dispatch(setSelectedTask(v))
            }
            tmpTasks = tmpTasks.map((task) => {
              return task.id === v.id ? v : task
            })
          })
          setTasks(() => tmpTasks)
          setCtxMenu({ ...ctxMenu, selectedTasks: t })
        }
        break
      case "afterReset":
        fetchTasks(true, false)
        dispatch(setSelectedTask(undefined))
        break
    }
  }

  return (
    <div
      className={styles.experiments}
      style={{
        height: `calc(100% - ${selectedTasks.keys.length > 1 ? 105 : 55}px)`,
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
                setCtxMenu({
                  ...ctxMenu,
                  isArchive: !showArchive,
                  selectedTasks: [],
                  target: undefined,
                })
                setSelectedTasks({ keys: [], rows: [] })
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
              collapsible
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
                      selectedRowKeys: selectedTasks.keys,
                      onChange: (
                        selectedRowKeys: Key[],
                        selectedRows: Task[],
                      ) => {
                        setSelectedTasks({
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
                  selectedKeys={selectedTasks}
                  setSelectedKeys={(e) => {
                    setSelectedTasks(e)
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
                <Panel>
                  <MenuContext.Provider value={ctxMenu}>
                    <ExperimentDetails onTaskChange={dispatchCtxMenuAct}>
                      <Outlet />
                    </ExperimentDetails>
                  </MenuContext.Provider>
                </Panel>
              </>
            )}
          </PanelGroup>
        </>
      )}
      {fullView && (
        <MenuContext.Provider value={ctxMenu}>
          <ExperimentDetails onTaskChange={dispatchCtxMenuAct}>
            <Outlet />
          </ExperimentDetails>
        </MenuContext.Provider>
      )}
      <MenuContext.Provider value={ctxMenu}>
        <ExperimentMenu dispatch={dispatchCtxMenuAct} />
      </MenuContext.Provider>
    </div>
  )
}
