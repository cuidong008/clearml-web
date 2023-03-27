import styles from "./index.module.scss"
import { Button, Collapse } from "antd"
import { Markdown } from "@/components/Markdown"
import { useEffect, useState } from "react"
import { useStoreSelector } from "@/store"
import { MetricColumn } from "@/types/common"
import { MetricValueType } from "@/types/enums"

export const Overview = () => {
  const projectSelected = useStoreSelector(
    (state) => state.project.selectedProject,
  )
  const projectPreference = useStoreSelector((state) => state.app.preferences)
  const [graphVariant, setGraphVariant] = useState<MetricColumn>()
  const [showMetricDialog, setShowMetricDialog] = useState(false)

  useEffect(() => {
    if (projectSelected && projectPreference.rootProjects) {
      setGraphVariant(
        projectPreference.rootProjects.graphVariant[projectSelected.id],
      )
      if (projectSelected.description) {
        setShowOverview(true)
      }
    }
  }, [projectSelected, projectPreference])

  const [showOverview, setShowOverview] = useState(
    !!projectSelected?.description,
  )

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

  return (
    <div className={styles.overview}>
      <Collapse className={styles.metricPanel} expandIconPosition="end">
        <Collapse.Panel
          key={1}
          header={
            <div className={styles.metricHeader}>
              Metric Snapshot
              <div className={styles.metricSelect}>
                {graphVariant && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowMetricDialog(true)
                    }}
                  >
                    {graphVariant.metric +
                      " \u203A " +
                      graphVariant.variant +
                      " \u203A " +
                      getValueName(graphVariant.valueType)}
                  </Button>
                )}
              </div>
            </div>
          }
        >
          {!graphVariant && (
            <div className={styles.placeholder}>
              <i className="al-icon al-ico-no-scatter-graph xxl"></i>
              <div className={styles.noDataTitle}>
                Select Metric &amp; Variant
              </div>
            </div>
          )}
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
        />
      )}
    </div>
  )
}
