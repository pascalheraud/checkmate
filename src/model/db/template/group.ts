"use server";
import { createDBObject, getDBObject, Identified, sql } from "@/model/db/db";
import {
  TemplateGroup,
  TemplateGroupId,
  TemplateGroupWithInfo,
  TemplateGroupWithItems,
  TemplateId,
} from "../../model";
import { getTemplateGroupItems } from "./item";

export interface NewTemplateGroup {
  name: string;
}
interface CreatedTemplateGroup
  extends NewTemplateGroup,
    Identified<TemplateGroup> {}

export async function getTemplateGroups(
  templateId: TemplateId
): Promise<TemplateGroupWithInfo[]> {
  return await sql<
    TemplateGroupWithInfo[]
  >`  SELECT ctg.*,
        exists (select 1 from template_item it where ctg.id = it.template_group_id) as has_items
      FROM template_group ctg
      WHERE template_id=${templateId}`;
}

export async function getTemplateGroup(
  id: TemplateGroupId
): Promise<TemplateGroup> {
  return getDBObject(
    sql<
      TemplateGroup[]
    >`SELECT * FROM template_group where id=${id}`
  );
}
export async function createTemplateGroup(
  templateId: TemplateId,
  group: NewTemplateGroup
): Promise<CreatedTemplateGroup> {
  return await createDBObject(
    sql<
      TemplateGroup[]
    >`INSERT INTO template_group(name, template_id) values (${group.name},${templateId}) RETURNING Id`,
    group as CreatedTemplateGroup
  );
}

export async function deleteTemplateGroup(
  templateId: TemplateId,
  groupId: TemplateGroupId
): Promise<TemplateGroupWithInfo[]> {
  await sql`DELETE FROM template_group where id=${groupId}`;
  return getTemplateGroups(templateId);
}

export async function getGroupsWithItems(
  groupId: TemplateGroupId
): Promise<TemplateGroupWithItems> {
  const group = (await getTemplateGroup(
    groupId
  )) as TemplateGroupWithItems;
  group.items = await getTemplateGroupItems(groupId);
  return group;
}
