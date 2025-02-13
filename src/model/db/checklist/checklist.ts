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
  ChecklistTemplateGroup,
  ChecklistTemplateId,
  ChecklistTemplateItem,
} from "@/model/model";
import {
  getTemplateGroupItems,
  getTemplateItem,
} from "@/model/db/template/item";
import { getChecklistTemplate } from "../template/template";

interface NewChecklist {
  templateId: ChecklistTemplateId;
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
  templateId: ChecklistTemplateId,
  name: string
): Promise<CreatedChecklist> {
  const checklist = await createDBObject(
    sql<
      Checklist[]
    >`INSERT INTO checklist(template_id, name, status) values (${templateId},${name},'KO') RETURNING Id`,
    {} as CreatedChecklist
  );

  const templateGroups = await getTemplateGroups(templateId);
  templateGroups.forEach(async (templateGroup) => {
    await createGroup(checklist.id, templateGroup);
  });

  return checklist;
}

export async function createGroup(
  checklistId: ChecklistId,
  templateGroup: ChecklistTemplateGroup
): Promise<CreatedChecklistGroup> {
  const group = await createDBObject(
    sql<
      ChecklistGroup[]
    >`INSERT INTO checklist_group(checklist_id, checklist_template_group_id, status) values (${checklistId},${templateGroup.id},'KO') RETURNING Id`,
    {} as CreatedChecklistGroup
  );

  const templateItems = await getTemplateGroupItems(templateGroup.id);
  templateItems.forEach(async (templateItem) => {
    await createItem(group.id, templateItem);
  });

  return group;
}

export async function createItem(
  groupId: ChecklistGroupId,
  templateItem: ChecklistTemplateItem
): Promise<CreatedChecklistItem> {
  const item = await createDBObject(
    sql<
      ChecklistItem[]
    >`INSERT INTO checklist_item(checklist_group_id, checklist_template_item_id, status) values (${groupId},${templateItem.id},'KO') RETURNING Id`,
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
  checklist.templateChecklist = await getChecklistTemplate(
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

  groups.forEach(async (group) => {
    group.templateGroup = await getTemplateGroup(
      group.checklistTemplateGroupId
    );
    group.items = await getChecklistGroupItems(group.id);
    group.items.forEach(async (item) => {
      item.templateItem = await getTemplateItem(item.checklistTemplateItemId);
    });
  });

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
  id: ChecklistTemplateId
): Promise<Checklist[]> {
  return await sql<
    Checklist[]
  >`SELECT * FROM checklist where template_id=${id}`;
}
