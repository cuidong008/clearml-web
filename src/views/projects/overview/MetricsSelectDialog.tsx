import styles from "@/views/projects/index.module.scss"
import { Collapse, Modal, Radio, Space } from "antd"
import { MetricVariantResult } from "@/api/models/project"
import { useEffect, useState } from "react"
import { map } from "lodash"
import { MetricColumn } from "@/types/common"
import { MetricValueType } from "@/types/enums"

export const MetricsSelectDialog = (props: {
  show: boolean
  onClose: (e?: MetricColumn) => void
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
    onClose(selectVariant)
  }

  function getHash(val: string, field: keyof MetricVariantResult): string {
    const variant = variants.filter((v) => v[field] === val)
    return variant?.[0][`${field}_hash` as keyof MetricVariantResult] ?? ""
  }

  function setVariant(group: string, value: string) {
    setSelectVariant({
      metric: group,
      metricHash: getHash(group, "metric"),
      valueType: "value",
      variant: value,
      variantHash: getHash(value, "variant"),
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

  return (
    <Modal
      open={show}
      onOk={updateChart}
      onCancel={() => onClose()}
      title={<div></div>}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          <i
            className="al-ico-no-scatter-graph"
            style={{ color: "#8492c2", fontSize: 60 }}
          />
        </div>
        <span className={styles.projectDialogTitle}>METRIC SNAPSHOT</span>
      </div>
      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        <Collapse>
          {map(metricTree, (metrics, group) => (
            <Collapse.Panel key={group} header={group}>
              <Radio.Group
                value={selectVariant?.variant}
                onChange={(e) => setVariant(group, e.target.value)}
              >
                <Space direction="vertical">
                  {metrics.map((m) => (
                    <li key={m.variant}>
                      <Radio value={m.variant}>{m.variant}</Radio>
                      {selectVariant?.variant === m.variant && (
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
