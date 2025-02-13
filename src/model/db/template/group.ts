"use server";
import { createDBObject, getDBObject, Identified, sql } from "@/model/db/db";
import {
  ChecklistTemplateGroup,
  ChecklistTemplateGroupId,
  ChecklistTemplateGroupWithItems,
  ChecklistTemplateId,
} from "../../model";
import { getTemplateGroupItems } from "./item";

export interface NewTemplateGroup {
  name: string;
}
interface CreatedTemplateGroup
  extends NewTemplateGroup,
    Identified<ChecklistTemplateGroup> {}

export async function getTemplateGroups(
  templateId: ChecklistTemplateId
): Promise<ChecklistTemplateGroup[]> {
  return await sql<
    ChecklistTemplateGroup[]
  >`SELECT * FROM checklist_template_group where checklist_template_id=${templateId}`;
}

export async function getTemplateGroup(
  id: ChecklistTemplateGroupId
): Promise<ChecklistTemplateGroup> {
  return getDBObject(
    sql<
      ChecklistTemplateGroup[]
    >`SELECT * FROM checklist_template_group where id=${id}`
  );
}
export async function createTemplateGroup(
  templateId: ChecklistTemplateId,
  group: NewTemplateGroup
): Promise<CreatedTemplateGroup> {
  return await createDBObject(
    sql<
      ChecklistTemplateGroup[]
    >`INSERT INTO checklist_template_group(name, checklist_template_id) values (${group.name},${templateId}) RETURNING Id`,
    group as CreatedTemplateGroup
  );
}

export async function deleteTemplateGroup(
  templateId: ChecklistTemplateId,
  groupId: ChecklistTemplateGroupId
): Promise<ChecklistTemplateGroup[]> {
  await sql`DELETE FROM checklist_template_group where id=${groupId}`;
  return getTemplateGroups(templateId);
}

export async function getGroupsWithItems(
  groupId: ChecklistTemplateGroupId
): Promise<ChecklistTemplateGroupWithItems> {
  const group = (await getTemplateGroup(
    groupId
  )) as ChecklistTemplateGroupWithItems;
  group.items = await getTemplateGroupItems(groupId);
  return group;
}
