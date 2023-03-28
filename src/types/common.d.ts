import {
  ColHeaderFilterTypeEnum,
  ColHeaderTypeEnum,
  FilterMatchModeEnum,
  MetricValueType,
} from "@/types/enums"

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

export interface ISmCol {
  id: string // unique id, by default, will be use as the table data param (e.g name and data[name]).
  getter?: string | string[]
  header?: string // the title header.
  label?: string // Labels to show in cards mode..
  hidden?: boolean // the column visibility.
  frozen?: boolean
  headerType?: ColHeaderTypeEnum
  filterType?: ColHeaderFilterTypeEnum
  sortable?: boolean // determine if the column shell be sortable
  searchableFilter?: boolean
  filterable?: boolean // determine if the column shell be filterable
  isFiltered?: boolean // deprecated.
  isSorted?: boolean // deprecated.
  filterMatchMode?: FilterMatchModeEnum // the filter method.
  style?: { width?: string; minWidth?: string; maxWidth?: string } // the column style.
  headerStyleClass?: string // the header css class name.
  bodyTemplateRef?: string // redundant.
  bodyStyleClass?: string
  disableDrag?: boolean // Disable drag on this col
  disablePointerEvents?: boolean // Disable pointer events for this col header (for selection col)
  metric_hash?: string
  variant_hash?: string
  isParam?: boolean
  valueType?: string
  projectId?: string
  datasetId?: string
  textCenter?: boolean
  andFilter?: boolean
  excludeFilter?: boolean
  columnExplain?: string
  key?: string
  type?: string
  showInCardFilters?: boolean
}
