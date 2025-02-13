"use client";
import { getChecklistWithGroups } from "@/model/db/checklist/checklist";
import { Checklist, ChecklistId } from "@/model/model";
import { useEffect, useState } from "react";

export default function ChecklistEdit({
  params,
}: {
  params: Promise<{ checklistId: ChecklistId }>;
}) {
  const [checklist, setChecklist] = useState<Checklist>();
  useEffect(() => {
    const action = async () => {
      setChecklist(await getChecklistWithGroups((await params).checklistId));
    };
    action();
  }, [params]);

  function Groups() {
    if (checklist) {
      return checklist.groups.map((group) => (
        <div key={group.id}>
          {group.templateGroup.name}
          <br />
          {group.items.map((item) => (
            <div key={item.id}>
              Group : {item.templateItem.name}
              <br />
              {item.status}
            </div>
          ))}
        </div>
      ));
    } else {
      return;
    }
  }

  return (
    <div>
      Checklist {checklist?.name}
      <br />
      <Groups />
    </div>
  );
}
