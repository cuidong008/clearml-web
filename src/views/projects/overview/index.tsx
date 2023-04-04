import styles from "./index.module.scss"
import { Button, Collapse, Empty, message, Tooltip, Typography } from "antd"
import { Markdown } from "@/components/Markdown"
import { useEffect, useRef, useState } from "react"
import { useStoreSelector, useThunkDispatch } from "@/store"
import { MetricColumn } from "@/types/common"
import { MetricValueType, TaskStatusEnum } from "@/types/enums"
import { projectsGetUniqueMetricVariants, projectUpdate } from "@/api/project"
import { setProjectSelected } from "@/store/project/project.actions"
import { getTasksAllEx } from "@/api/task"
import { createMetricColumn } from "@/utils/metric"
import { ProjectStatsGraphData } from "@/types/project"
import { cloneDeep, get, sortBy } from "lodash"
import * as echarts from "echarts/core"
import { getItemStyle, option, statusToColor } from "./metricChartOpt"
import { MetricsSelectDialog } from "./MetricsSelectDialog"
import { MetricVariantResult } from "@/api/models/project"
import { uploadUserPreference } from "@/store/app/app.actions"
import { UserPreference } from "@/types/store"

export const Overview = () => {
  const projectSelected = useStoreSelector(
    (state) => state.project.selectedProject,
  )
  const rootProjects: UserPreference["rootProjects"] = useStoreSelector(
    (state) => state.app.preferences.rootProjects,
  )
  const [graphVariant, setGraphVariant] = useState<MetricColumn>()
  const [showMetricDialog, setShowMetricDialog] = useState(false)
  const [graphData, setGraphData] = useState<ProjectStatsGraphData[]>([])
  const [variants, setVariants] = useState<MetricVariantResult[]>([])
  const [showOverview, setShowOverview] = useState(false)
  const refChartIns = useRef<echarts.ECharts>()
  const refChart = useRef<HTMLDivElement>(null)

  const dispatch = useThunkDispatch()

  useEffect(() => {
    if (projectSelected && rootProjects) {
      setGraphVariant(rootProjects.graphVariant[projectSelected.id])
      if (projectSelected.description) {
        setShowOverview(true)
      }
    }
  }, [projectSelected, rootProjects])

  useEffect(() => {
    if (refChart.current && graphData) {
      if (!refChartIns.current) {
        refChartIns.current = echarts.init(refChart.current)
      }
      const chartOpt = cloneDeep(option)
      chartOpt.series = ["completed or stopped", "failed", "published"].map(
        (t: string) => {
          return {
            name: "completed or stopped",
            type: "scatter",
            data: graphData
              .filter((d) => t.includes(d.status))
              .map<(number | string)[]>((d) => [
                d.x,
                d.y,
                d.name,
                d.nameExt,
                d.id,
              ]),
            ...getItemStyle(t),
          }
        },
      )
      refChartIns.current?.setOption(chartOpt)
    }
  }, [graphData])

  useEffect(() => {
    return () => {
      refChartIns.current?.dispose()
      refChartIns.current = undefined
    }
  }, [])

  function getValueName(valueType: MetricValueType) {
    switch (valueType) {
      case "max_value":
        return "Max"
      case "min_value":
        return "Min"
      default:
        return "Last"
    }
  }

  function projectSetDescription(info: string, callback: () => void) {
    if (!projectSelected) {
      return
    }
    projectUpdate({ project: projectSelected.id, description: info })
      .then(({ data, meta }) => {
        if (meta.result_code !== 200) {
          message.error(meta.result_msg)
          return
        }
        message.success(
          `update project description "${projectSelected.name}" success`,
        )
        callback()
        if (info === "") {
          setShowOverview(false)
        }
        dispatch(setProjectSelected({ ...projectSelected, description: info }))
      })
      .catch((err) => {
        message.error(
          `update project ${projectSelected.name}'s description failure`,
        )
      })
  }

  function fetchGraphData(e?: MetricColumn) {
    if (!e || !projectSelected) {
      return
    }
    const col = createMetricColumn(e, projectSelected.id)
    getTasksAllEx({
      project: [projectSelected.id],
      only_fields: [
        "started",
        "last_iteration",
        "user.name",
        "type",
        "name",
        "status",
        "active_duration",
        col.id,
      ],
      [col.id]: [0, null],
      started: ["2000-01-01T00:00:00", null],
      status: ["completed", "published", "failed", "stopped", "closed"],
      order_by: ["-started"],
      type: [
        "__$not",
        "annotation_manual",
        "__$not",
        "annotation",
        "__$not",
        "dataset_import",
      ],
      system_tags: ["-archived"],
      size: 1000,
    }).then(({ data, meta }) => {
      if (meta.result_code !== 200) {
        message.error(meta.result_msg)
        return
      }
      const graphicData = data.tasks?.map<ProjectStatsGraphData>((task) => {
        const started = new Date(task.started ?? new Date()).getTime()
        const end = started + (task.active_duration ?? 0) * 1000
        return {
          id: task.id,
          y: get(task, col.id), // col.id is a path (e.g.) last_metric.x.max_value, must use lodash get
          x: end,
          name: task.name ?? "",
          status: task.status ?? "",
          type: task.type ?? "",
          user: task.user?.name ?? "",
          title: task.name,
          nameExt: `Created By ${task.user?.name ?? ""}, Finished ${new Date(
            end,
          ).toLocaleString()}`,
        }
      })
      setGraphData(graphicData ?? [])
    })
  }

  function openSelectVariantsDialog() {
    projectsGetUniqueMetricVariants({
      project: projectSelected?.id,
      include_subprojects: true,
    })
      .then(({ data, meta }) => {
        if (meta.result_code !== 200) {
          message.error(meta.result_msg)
          return
        }
        setVariants(
          sortBy(data.metrics, (item) =>
            item?.metric?.replace(":", "~").toLowerCase(),
          ),
        )
        setShowMetricDialog(true)
      })
      .catch(() => {
        message.error("get projects unique metric variants failure")
      })
  }

  function resetMetricSelect(evt: string, e?: MetricColumn) {
    setShowMetricDialog(false)
    if (evt === "update" && e) {
      setGraphData([])
      setGraphVariant(e)
      if (rootProjects && projectSelected) {
        const newRootProject = cloneDeep(rootProjects)
        newRootProject.graphVariant[projectSelected.id] = e
        dispatch(uploadUserPreference("rootProjects", { ...newRootProject }))
      }
      fetchGraphData(e)
    }
    if (evt === "clear") {
      setGraphData([])
      if (rootProjects && projectSelected) {
        const newRootProject = cloneDeep(rootProjects)
        delete newRootProject.graphVariant[projectSelected.id]
        dispatch(uploadUserPreference("rootProjects", { ...newRootProject }))
      }
      setGraphVariant(undefined)
    }
  }

  return (
    <div className={styles.overview}>
      <MetricsSelectDialog
        show={showMetricDialog}
        onClose={(evt, e) => resetMetricSelect(evt, e)}
        variants={variants}
        selectedVariant={graphVariant}
      />
      <Collapse
        bordered={false}
        className={styles.metricPanel}
        expandIconPosition="end"
        onChange={(e) => e.length > 0 && fetchGraphData(graphVariant)}
      >
        <Collapse.Panel
          key={1}
          header={
            <div className={styles.metricHeader}>
              Metric Snapshot
              <div className={styles.metricSelect}>
                {graphVariant && (
                  <Button
                    style={{ maxWidth: 200 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      openSelectVariantsDialog()
                    }}
                  >
                    <Tooltip
                      color="blue"
                      title={`${graphVariant.metric} > ${
                        graphVariant.variant
                      } > ${getValueName(graphVariant.valueType)}`}
                    >
                      <Typography.Text ellipsis>
                        {`${graphVariant.metric} > ${
                          graphVariant.variant
                        } > ${getValueName(graphVariant.valueType)}`}
                      </Typography.Text>
                    </Tooltip>
                  </Button>
                )}
              </div>
            </div>
          }
        >
          {!graphVariant && (
            <div className={styles.placeholder}>
              <i className="al-icon al-ico-no-scatter-graph xxl"></i>
              <div
                onClick={() => openSelectVariantsDialog()}
                className={styles.noDataTitle}
              >
                Select Metric &amp; Variant
              </div>
            </div>
          )}
          {graphVariant && !graphData.length && <Empty></Empty>}
          <div style={{ visibility: graphData.length ? "visible" : "hidden" }}>
            <div ref={refChart} style={{ height: "250px" }} />
            <div className={styles.legend}>
              {[
                {
                  label: "Completed or Stopped",
                  type: TaskStatusEnum.Completed,
                },
                { label: "Published", type: TaskStatusEnum.Published },
                { label: "Failed", type: TaskStatusEnum.Failed },
              ].map((s) => (
                <span
                  key={s.label}
                  id={`entry-${s.type}`}
                  className={styles.entry}
                >
                  <style>{`#entry-${
                    s.type
                  }:before{background-color:${statusToColor(s.type)}`}</style>
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
      {!showOverview && (
        <div className={styles.newOverview}>
          <i className="icon i-markdown xxl"></i>
          <div className={styles.noDataTitle}>THERE’S NOTHING HERE YET…</div>
          <button
            className={styles.noDataBtn}
            onClick={() => setShowOverview(true)}
          >
            <span>ADD PROJECT OVERVIEW</span>
          </button>
        </div>
      )}
      {showOverview && (
        <Markdown
          value={projectSelected?.description}
          className={styles.markdown}
          onCancel={() => setShowOverview(false)}
          onChange={(e, callback) => projectSetDescription(e, callback)}
        />
      )}
    </div>
  )
}
