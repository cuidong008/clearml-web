import styles from "./index.module.scss"
import { Button, Collapse, Input, Modal, Radio, Space } from "antd"
import { MetricVariantResult } from "@/api/models/project"
import { useEffect, useState } from "react"
import { map } from "lodash"
import { MetricColumn } from "@/types/common"
import { MetricValueType } from "@/types/enums"

export const MetricsSelectDialog = (props: {
  show: boolean
  onClose: (evt: string, e?: MetricColumn) => void
  variants: MetricVariantResult[]
  selectedVariant?: MetricColumn
}) => {
  const { show, onClose, variants, selectedVariant } = props
  const [metricTree, setMetricTree] = useState<
    Record<string, MetricVariantResult[]>
  >({})
  const [selectVariant, setSelectVariant] = useState<MetricColumn>()

  useEffect(() => {
    setMetricTree(() =>
      variants.reduce((result, metric) => {
        result[metric.metric]
          ? result[metric.metric].push(metric)
          : (result[metric.metric] = [metric])
        return result
      }, {} as Record<string, MetricVariantResult[]>),
    )
    const filteredMetricTree = Object.entries(metricTree)
    console.log(metricTree, filteredMetricTree)
  }, [variants])

  useEffect(() => {
    if (selectedVariant) {
      setSelectVariant(selectedVariant)
    }
  }, [selectedVariant])

  function updateChart() {
    if (selectVariant) {
      onClose("update", selectVariant)
      return
    }
    onClose("clear")
  }

  function getHash(
    group: string,
    val: string,
    field: keyof MetricVariantResult,
  ): string {
    const variant = variants.filter(
      (v) => v[field] === val && v.metric === group,
    )
    return variant?.[0][`${field}_hash` as keyof MetricVariantResult] ?? ""
  }

  function setVariant(group: string, value: string) {
    setSelectVariant({
      metric: group,
      metricHash: getHash(group, group, "metric"),
      valueType: "value",
      variant: value.split("/")[1],
      variantHash: getHash(group, value.split("/")[1], "variant"),
    })
  }

  function setValueType(val: MetricValueType) {
    setSelectVariant({
      metric: selectVariant?.metric ?? "",
      metricHash: selectVariant?.metricHash ?? "",
      valueType: val,
      variant: selectVariant?.variant ?? "",
      variantHash: selectVariant?.variantHash ?? "",
    })
  }

  function filterMetricsTree(value: string) {
    setSelectVariant(undefined)
    if (value) {
      const filteredMetric = Object.entries(metricTree).map<
        [string, MetricVariantResult[]]
      >(([f, results]) => [
        f,
        results.filter((variant) => variant.variant?.includes(value)),
      ])
      const metrics: Record<string, MetricVariantResult[]> = {}
      filteredMetric.forEach((f) => {
        if (f[1].length) {
          metrics[f[0]] = f[1]
        }
      })
      setMetricTree(metrics)
    } else {
      setMetricTree(() =>
        variants.reduce((result, metric) => {
          result[metric.metric]
            ? result[metric.metric].push(metric)
            : (result[metric.metric] = [metric])
          return result
        }, {} as Record<string, MetricVariantResult[]>),
      )
    }
  }

  return (
    <Modal
      className={styles.metricDialog}
      open={show}
      onOk={updateChart}
      onCancel={() => onClose("close")}
      title={<div></div>}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          <i
            className="al-ico-no-scatter-graph"
            style={{ color: "#8492c2", fontSize: 60 }}
          />
        </div>
        <span className={styles.metricDialogHeader}>METRIC SNAPSHOT</span>
      </div>
      <div className={styles.metricSearch}>
        <Input.Search
          className={styles.searchInput}
          onSearch={(e) => filterMetricsTree(e)}
          allowClear
        />
        <Button onClick={() => setSelectVariant(undefined)}>Clear</Button>
      </div>

      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        <Collapse bordered={false} className={styles.metricDialogPanel}>
          {map(metricTree, (metrics, group) => (
            <Collapse.Panel key={group} header={group}>
              <Radio.Group
                value={`${selectVariant?.metric}/${selectVariant?.variant}`}
                onChange={(e) => setVariant(group, e.target.value)}
              >
                <Space direction="vertical">
                  {metrics.map((m) => (
                    <li key={m.variant}>
                      <Radio value={`${m.metric}/${m.variant}`}>
                        {m.variant}
                      </Radio>
                      {selectVariant?.variantHash === m.variant_hash &&
                        selectVariant?.metric === group && (
                          <div style={{ paddingLeft: 30 }}>
                            <Radio.Group
                              defaultValue="value"
                              value={selectVariant?.valueType}
                              onChange={(e) => setValueType(e.target.value)}
                            >
                              <Radio value="value">LAST</Radio>
                              <Radio value="min_value">MIN</Radio>
                              <Radio value="max_value">MAX</Radio>
                            </Radio.Group>
                          </div>
                        )}
                    </li>
                  ))}
                </Space>
              </Radio.Group>
            </Collapse.Panel>
          ))}
        </Collapse>
      </div>
    </Modal>
  )
}
