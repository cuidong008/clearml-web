export interface Model {
  id?: string;
  name?: string;
  user?: string;
  company?: string;
  created?: string;
  last_update?: string;
  task?: string;
  parent?: string;
  project?: string;
  comment?: string;
  tags?: Array<string>;
  system_tags?: Array<string>;
  framework?: string;
  design?: object;
  labels?: { [key: string]: number };
  uri?: string;
  ready?: boolean;
  ui_cache?: object;
  metadata?: Array<MetadataItem>;
}
