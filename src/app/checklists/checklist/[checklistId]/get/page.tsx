"use client";
import { getChecklistWithGroups } from "@/model/db/checklist/checklist";
import { Checklist, ChecklistId } from "@/model/model";
import { useEffect, useState } from "react";
import { Alert } from "flowbite-react";

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
        <li key={group.id} className="list-disc ">
            Group : {group.templateGroup.name} Status : {group.status}
            <br /> 
            <ul className="list-disc pl-6">
              {group.items.map((item) => (
                <li key={item.id}>
                  Item : {item.templateItem.name}
                  &nbsp; Status : {item.status}
                </li>
              ))}
            </ul>
        </li>
      ));
    } else {
      return;
    }
  }

  return (
    <div>
      Checklist {checklist?.name}
      <br />
      <ul className="list-disc">
        <Groups />
        <Alert color="info">Alert!</Alert>
      </ul>
    </div>
  );
}
