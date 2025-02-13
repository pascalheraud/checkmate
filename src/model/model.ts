import { Identified } from "./db/db";

export type ID<T> = number & { __brand: T };

export type ChecklistTemplateId = ID<ChecklistTemplate>;
export interface ChecklistTemplate {
  id: ChecklistTemplateId;
  name: string;
}
export type ChecklistTemplateGroupId = ID<ChecklistTemplateGroup>;
export interface ChecklistTemplateGroup {
  id: ChecklistTemplateGroupId;
  name: string;
}
export interface ChecklistTemplateGroupWithItems
  extends ChecklistTemplateGroup {
  items: ChecklistTemplateItem[];
}

export interface ChecklistTemplateWithGroups extends ChecklistTemplate {
  groups: ChecklistTemplateGroup[];
}

export type ChecklistTemplateItemId = ID<ChecklistTemplateItem>;
export interface ChecklistTemplateItem {
  id: ChecklistTemplateItemId;
  name: string;
}

export type ChecklistStatus = "OK" | "KO" | "NA";

export type ChecklistId = ID<Checklist>;
export interface Checklist extends Identified<Checklist> {
  name: string;
  templateId: ChecklistTemplateId;
  groups: ChecklistGroup[];
  status: ChecklistStatus;
  templateChecklist: ChecklistTemplate;
}

export type ChecklistGroupId = ID<ChecklistGroup>;
export interface ChecklistGroup extends Identified<ChecklistGroup> {
  checklistTemplateGroupId: ChecklistTemplateGroupId;
  items: ChecklistItem[];
  status: ChecklistStatus;
  templateGroup: ChecklistTemplateGroup;
}

export type ChecklistItemId = ID<ChecklistItem>;
export interface ChecklistItem extends Identified<ChecklistItem> {
  checklistTemplateItemId: ChecklistTemplateItemId;
  status: ChecklistStatus;
  templateItem: ChecklistTemplateItem;
}
