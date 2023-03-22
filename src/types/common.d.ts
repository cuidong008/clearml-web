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
