import { Identified } from "./db/db";

export type ID<T> = number & { __brand: T };

export type TemplateId = ID<Template>;
export interface Template {
  id: TemplateId;
  name: string;
}
export type TemplateGroupId = ID<TemplateGroup>;
export interface TemplateGroup {
  id: TemplateGroupId;
  name: string;
}
export interface TemplateGroupWithItems
  extends TemplateGroup {
  items: TemplateItem[];
}

export interface TemplateWithInfo extends Template {
  hasInstances: boolean;
}
export interface TemplateWithGroups extends Template {
  groups: TemplateGroupWithInfo[];
}

export interface TemplateGroupWithInfo extends TemplateGroup {
  hasItems: boolean;
}

export type TemplateItemId = ID<TemplateItem>;
export interface TemplateItem {
  id: TemplateItemId;
  name: string;
}

export type ChecklistStatus = "OK" | "KO" | "NA";

export type ChecklistId = ID<Checklist>;
export interface Checklist extends Identified<Checklist> {
  name: string;
  templateId: TemplateId;
  groups: ChecklistGroup[];
  status: ChecklistStatus;
  templateChecklist: Template;
}

export type ChecklistGroupId = ID<ChecklistGroup>;
export interface ChecklistGroup extends Identified<ChecklistGroup> {
  templateGroupId: TemplateGroupId;
  items: ChecklistItem[];
  status: ChecklistStatus;
  templateGroup: TemplateGroup;
}

export type ChecklistItemId = ID<ChecklistItem>;
export interface ChecklistItem extends Identified<ChecklistItem> {
  templateItemId: TemplateItemId;
  status: ChecklistStatus;
  templateItem: TemplateItem;
}
