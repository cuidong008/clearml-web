import { ColHeaderFilterTypeEnum, ColHeaderTypeEnum } from "@/types/enums"
import { ISmCol, MetricColumn } from "@/types/common"

export const getValueTypeName = (valueType: string) =>
  valueType.replace("_", "").replace("value", "").toUpperCase()
export const createMetricColumn = (
  column: MetricColumn,
  projectId: string,
): ISmCol => ({
  id: `last_metrics.${column.metricHash}.${column.variantHash}.${column.valueType}`,
  headerType: ColHeaderTypeEnum.sortFilter,
  sortable: true,
  filterable: true,
  filterType: ColHeaderFilterTypeEnum.durationNumeric,
  header: `${column.metric} > ${column.variant} ${getValueTypeName(
    column.valueType,
  )}`,
  hidden: false,
  metric_hash: column.metricHash,
  variant_hash: column.variantHash,
  valueType: column.valueType,
  projectId,
  style: { width: "115px" },
})
