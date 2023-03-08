import { Entry, MetadataItem } from "@/types/common";

export interface Queue {
  id?: string;
  name?: string;
  user?: string;
  company?: string;
  created?: string;
  tags?: Array<string>;
  system_tags?: Array<string>;
  entries?: Array<Entry>;
  workers?: Worker[];
  metadata?: Array<MetadataItem>;
}
