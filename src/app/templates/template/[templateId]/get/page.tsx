"use client";
import ItemsList from "@/components/itemslist";
import { deleteTemplateGroup } from "@/model/db/template/group";
import { getCTemplateWithGroups } from "@/model/db/template/template";
import {
  TemplateGroup,
  TemplateGroupWithInfo,
  TemplateId,
  TemplateWithGroups,
} from "@/model/model";
import { useEffect, useState } from "react";

export default function Template({
  params,
}: {
  params: Promise<{ templateId: TemplateId }>;
}) {
  const [template, setTemplate] = useState<TemplateWithGroups>();
  useEffect(() => {
    const action = async () => {
      setTemplate(
        await getCTemplateWithGroups((await params).templateId)
      );
    };
    action();
  }, [params]);

  async function deleteGroup(
    group: TemplateGroupWithInfo
  ): Promise<void> {
    const groups = await deleteTemplateGroup(template!.id, group.id);
    setTemplate({ ...template!, groups: groups });
  }

  function isDeletableGroup(template: TemplateGroupWithInfo): boolean {
    return !template.hasItems;
  }

  function Groups() {
    if (template) {
      return (
        <ItemsList
          viewLink={(group: TemplateGroup) =>
            `/templates/template/${template!.id}/groups/group/${group.id}/get`
          }
          newLink={`/templates/template/${template!.id}/groups/new`}
          items={template!.groups}
          deleteItem={deleteGroup}
          itemsLabel={`Template "${template.name}" Groups`}
          isDeletable={isDeletableGroup}
          modalLabel="This Group has at least one item and cannot be removed"
          removableTitle="Remove the group"
          newLabel="New Group"
          unremovableTitle="This Group has at least one item"
        />
      );
    } else return;
  }

  return <Groups />;
}
