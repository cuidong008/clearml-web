export interface SubProject {
  /**
   * Subproject ID
   */
  id?: string;
  /**
   * Subproject name
   */
  name?: string;
}

export interface DatasetStats {
  /**
   * The number of files stored in the dataset
   */
  file_count?: number;
  /**
   * The total dataset size in bytes
   */
  total_size?: number;
}

export interface Project {
  /**
   * Project id
   */
  id?: string;
  /**
   * Project name
   */
  name?: string;
  /**
   * Project base name
   */
  basename?: string;
  /**
   * Project description
   */
  description?: string;
  /**
   * Associated user id
   */
  user?: string;
  /**
   * Company id
   */
  company?: { id: string; name?: string };
  /**
   * Creation time
   */
  created?: string;
  /**
   * User-defined tags
   */
  tags?: Array<string>;
  /**
   * System tags. This field is reserved for system use, please don\'t use it.
   */
  system_tags?: Array<string>;
  /**
   * The default output destination URL for new tasks under this project
   */
  default_output_destination?: string;
  stats?: Stats;
  dataset_stats?: DatasetStats;
  /**
   * Last project update time. Reflects the last time the project metadata was changed or a task in this project has changed status
   */
  last_update?: string;
  sub_projects?: SubProject[];

  own_tasks?: number;
  own_models?: number;
}
