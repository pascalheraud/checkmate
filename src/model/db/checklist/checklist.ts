"use server";
import { createDBObject, getDBObject, Identified, sql } from "@/model/db/db";
import { getTemplateGroup, getTemplateGroups } from "@/model/db/template/group";
import {
  Checklist,
  ChecklistGroup,
  ChecklistGroupId,
  ChecklistId,
  ChecklistItem,
  ChecklistStatus,
  TemplateGroup,
  TemplateId,
  TemplateItem,
} from "@/model/model";
import {
  getTemplateGroupItems,
  getTemplateItem,
} from "@/model/db/template/item";
import { getTemplate } from "../template/template";

interface NewChecklist {
  templateId: TemplateId;
}

interface Status {
  status: ChecklistStatus;
}

export interface CreatedChecklist extends NewChecklist, Identified<Checklist> {}
export interface ChecklistWithGroups extends CreatedChecklist, Status {
  groups: CreatedChecklistGroupWithItems[];
}

interface CreatedChecklistGroup
  extends ChecklistGroup,
    Identified<ChecklistGroup> {}
export interface CreatedChecklistGroupWithItems
  extends CreatedChecklistGroup,
    Status {
  items: CreatedChecklistItem[];
}

interface CreatedChecklistItem
  extends ChecklistItem,
    Identified<ChecklistItem> {}

export async function createChecklist(
  templateId: TemplateId,
  name: string
): Promise<CreatedChecklist> {
  const checklist = await createDBObject(
    sql<
      Checklist[]
    >`INSERT INTO checklist(template_id, name, status) values (${templateId},${name},'KO') RETURNING Id`,
    {} as CreatedChecklist
  );

  const templateGroups = await getTemplateGroups(templateId);
  for (const templateGroup of templateGroups) {
    await createGroup(checklist.id, templateGroup);
  }

  return checklist;
}

export async function createGroup(
  checklistId: ChecklistId,
  templateGroup: TemplateGroup
): Promise<CreatedChecklistGroup> {
  const group = await createDBObject(
    sql<
      ChecklistGroup[]
    >`INSERT INTO checklist_group(checklist_id, template_group_id, status) values (${checklistId},${templateGroup.id},'KO') RETURNING Id`,
    {} as CreatedChecklistGroup
  );

  const templateItems = await getTemplateGroupItems(templateGroup.id);
  for (const templateItem of templateItems) {
    await createItem(group.id, templateItem);
  }

  return group;
}

export async function createItem(
  groupId: ChecklistGroupId,
  templateItem: TemplateItem
): Promise<CreatedChecklistItem> {
  const item = await createDBObject(
    sql<
      ChecklistItem[]
    >`INSERT INTO checklist_item(checklist_group_id, template_item_id, status) values (${groupId},${templateItem.id},'KO') RETURNING Id`,
    {} as CreatedChecklistItem
  );
  return item;
}

async function getChecklist(id: ChecklistId): Promise<Checklist> {
  return await getDBObject(
    sql<Checklist[]>`SELECT * FROM checklist where id=${id}`
  );
}

export async function getChecklistWithGroups(
  id: ChecklistId
): Promise<Checklist> {
  const checklist = await getChecklist(id);
  checklist.templateChecklist = await getTemplate(
    checklist.templateId
  );
  checklist.groups = await getChecklistGroupsWithItems(id);

  return checklist;
}

export async function getChecklistGroups(
  checklistId: ChecklistId
): Promise<ChecklistGroup[]> {
  return await sql<
    ChecklistGroup[]
  >`SELECT * FROM checklist_group where checklist_id=${checklistId}`;
}

export async function getChecklistGroupsWithItems(
  checklistId: ChecklistId
): Promise<ChecklistGroup[]> {
  const groups = await getChecklistGroups(checklistId);

  for (const group of groups) {
    group.templateGroup = await getTemplateGroup(
      group.templateGroupId
    );
    group.items = await getChecklistGroupItems(group.id);
    for (const item of group.items) {
      item.templateItem = await getTemplateItem(item.templateItemId);
    }
  }

  return groups;
}

export async function getChecklistGroupItems(
  groupId: ChecklistGroupId
): Promise<ChecklistItem[]> {
  return await sql<
    ChecklistItem[]
  >`SELECT * FROM checklist_item where checklist_group_id=${groupId}`;
}

export async function getChecklists(
  id: TemplateId
): Promise<Checklist[]> {
  return await sql<
    Checklist[]
  >`SELECT * FROM checklist where template_id=${id}`;
}
