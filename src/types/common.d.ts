import { MetricValueType } from "@/types/enums"

export interface MultiFieldPatternData {
  pattern?: string
  fields?: Array<string>
}

export interface MetadataItem {
  key?: string
  type?: string
  value?: string
}

export interface Entry {
  task?: string
  added?: string
}

export interface MetricColumn {
  metricHash: string
  variantHash: string
  valueType: MetricValueType
  metric: string
  variant: string
}
