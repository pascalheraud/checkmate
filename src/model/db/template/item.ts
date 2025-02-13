"use server";
import { createDBObject, getDBObject, Identified, sql } from "@/model/db/db";
import {
  ChecklistTemplateGroupId,
  ChecklistTemplateItem,
  ChecklistTemplateItemId,
} from "../../model";
export interface NewItem {
  name: string;
}
interface CreatedItem extends NewItem, Identified<ChecklistTemplateItem> {}

export async function getTemplateGroupItems(
  groupId: ChecklistTemplateGroupId
): Promise<ChecklistTemplateItem[]> {
  return await sql<
    ChecklistTemplateItem[]
  >`SELECT * FROM checklist_template_item where checklist_template_group_id=${groupId}`;
}

export async function getTemplateItem(
  itemId: ChecklistTemplateItemId
): Promise<ChecklistTemplateItem> {
  return getDBObject(
    sql<
      ChecklistTemplateItem[]
    >`SELECT * FROM checklist_template_item where id=${itemId}`
  );
}

export async function createTemplateItem(
  groupId: ChecklistTemplateItemId,
  item: NewItem
): Promise<CreatedItem> {
  return await createDBObject(
    sql<
      ChecklistTemplateItem[]
    >`INSERT INTO checklist_template_item(name, checklist_template_group_id) values (${item.name},${groupId}) RETURNING Id`,
    item as CreatedItem
  );
}

export async function deleteTemplateItem(
  groupId: ChecklistTemplateGroupId,
  itemId: number
): Promise<ChecklistTemplateItem[]> {
  await sql`DELETE FROM checklist_template_item where id=${itemId}`;
  return getTemplateGroupItems(groupId);
}
