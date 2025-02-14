"use server";
import { createDBObject, getDBObject, Identified, sql } from "../db";
import {
  Template as Template,
  TemplateId as TemplateId,
  TemplateWithGroups as TemplateWithGroups,
} from "../../model";
import { getTemplateGroups } from "./group";

interface NewTemplate {
  name: string;
}

export interface TemplateWithInfo extends Template {
  hasInstances: boolean;
  hasGroups: boolean;
}

interface CreatedTemplate extends NewTemplate, Identified<Template> {}

export async function createTemplate(
  template: NewTemplate
): Promise<CreatedTemplate> {
  return await createDBObject(
    sql<
      Template[]
    >`INSERT INTO template(name) values (${template.name}) RETURNING Id`,
    template as CreatedTemplate
  );
}

export async function getAllTemplates(): Promise<
  TemplateWithInfo[]
> {
  return await sql<
    TemplateWithInfo[]
  >`SELECT * ,
      exists (select 1 from checklist c where c.template_id = t.id) as has_instances,
      exists (select 1 from template_group tc where tc.template_id = t.id) as has_groups
    FROM template t`;
}

export async function deleteTemplate(
  id: TemplateId
): Promise<TemplateWithInfo[]> {
  await sql`DELETE FROM template where id=${id}`;
  return getAllTemplates();
}

export async function getTemplate(
  id: TemplateId
): Promise<Template> {
  return getDBObject(
    sql<Template[]>`SELECT * FROM template where id=${id}`
  );
}

export async function getCTemplateWithGroups(
  id: TemplateId
): Promise<TemplateWithGroups> {
  const template = (await getTemplate(
    id
  )) as TemplateWithGroups;
  template.groups = await getTemplateGroups(id);
  return template;
}
