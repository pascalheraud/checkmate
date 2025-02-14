"use server";
import { createDBObject, getDBObject, Identified, sql } from "@/model/db/db";
import {
  TemplateGroupId,
  TemplateItem,
  TemplateItemId,
} from "../../model";
export interface NewItem {
  name: string;
}
interface CreatedItem extends NewItem, Identified<TemplateItem> {}

export async function getTemplateGroupItems(
  groupId: TemplateGroupId
): Promise<TemplateItem[]> {
  return await sql<
    TemplateItem[]
  >`SELECT * FROM template_item where template_group_id=${groupId}`;
}

export async function getTemplateItem(
  itemId: TemplateItemId
): Promise<TemplateItem> {
  return getDBObject(
    sql<TemplateItem[]>`SELECT * FROM template_item where id=${itemId}`
  );
}

export async function createTemplateItem(
  groupId: TemplateItemId,
  item: NewItem
): Promise<CreatedItem> {
  return await createDBObject(
    sql<
      TemplateItem[]
    >`INSERT INTO template_item(name, template_group_id) values (${item.name},${groupId}) RETURNING Id`,
    item as CreatedItem
  );
}

export async function deleteTemplateItem(
  groupId: TemplateGroupId,
  itemId: number
): Promise<TemplateItem[]> {
  await sql`DELETE FROM template_item where id=${itemId}`;
  return getTemplateGroupItems(groupId);
}
