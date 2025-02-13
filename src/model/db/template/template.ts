"use server";
import { createDBObject, getDBObject, Identified, sql } from "../db";
import { ChecklistTemplate, ChecklistTemplateId, ChecklistTemplateWithGroups } from "../../model";
import { getTemplateGroups } from "./group";

interface NewTemplate {
  name: string;
}

interface CreatedTemplate extends NewTemplate, Identified<ChecklistTemplate> {}

export async function createChecklistTemplate(
  template: NewTemplate
): Promise<CreatedTemplate> {
  return await createDBObject(
    sql<
    ChecklistTemplate[]
    >`INSERT INTO checklist_template(name) values (${template.name}) RETURNING Id`,
    template as CreatedTemplate
  );
}

export async function getAllChecklistTemplates(): Promise<ChecklistTemplate[]> {
  return await sql<ChecklistTemplate[]>`SELECT * FROM checklist_template`;
}

export async function deleteChecklistTemplate(id: ChecklistTemplateId): Promise<ChecklistTemplate[]> {
  await sql`DELETE FROM checklist_template where id=${id}`;
  return getAllChecklistTemplates();
}

export async function getChecklistTemplate(id: ChecklistTemplateId): Promise<ChecklistTemplate> {
  return getDBObject(
    sql<ChecklistTemplate[]>`SELECT * FROM checklist_template where id=${id}`
  );
}

export async function getChecklistTemplateWithGroups(
  id: ChecklistTemplateId
): Promise<ChecklistTemplateWithGroups> {
  const template = (await getChecklistTemplate(id)) as ChecklistTemplateWithGroups;
  template.groups = await getTemplateGroups(id);
  return template;
}
