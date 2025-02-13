"use client";
import { deleteTemplateGroup } from "@/model/db/template/group";
import { getChecklistTemplateWithGroups } from "@/model/db/template/template";
import {
  ChecklistTemplateGroup,
  ChecklistTemplateId,
  ChecklistTemplateWithGroups,
} from "@/model/model";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Template({
  params,
}: {
  params: Promise<{ templateId: ChecklistTemplateId }>;
}) {
  const [template, setTemplate] = useState<ChecklistTemplateWithGroups>();
  useEffect(() => {
    const action = async () => {
      setTemplate(await getChecklistTemplateWithGroups((await params).templateId));
    };
    action();
  }, [params]);

  function GroupList({ groups }: { groups: ChecklistTemplateGroup[] }) {
    return groups.map((group: ChecklistTemplateGroup) => (
      <li key={group.id}>
        Name: {group.name}
        &nbsp;
        <Link href={`/templates/template/${template!.id}/groups/group/${group.id}/get`}>Voir</Link>
        &nbsp;
        <button
          onClick={async () => {
            const groups = await deleteTemplateGroup(template!.id, group.id);
            setTemplate({ ...template!, groups: groups });
          }}
        >
          Suppr
        </button>
      </li>
    ));
  }

  function Groups() {
    if (template) {
      return (
        <span>
          <ul className="list-disc">
            <GroupList groups={template.groups} />
          </ul>
          <Link href={`/templates/template/${template?.id}/groups/new`}>New group</Link>
        </span>
      );
    } else return;
  }

  return (
    <div>
      <h1>Template details {template?.name}</h1>
      <br />
      <Groups />
    </div>
  );
}
