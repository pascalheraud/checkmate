"use client";
import { getChecklists } from "@/model/db/checklist/checklist";
import { Checklist, ChecklistTemplateId } from "@/model/model";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Checklists({
  params,
}: {
  params: Promise<{ templateId: ChecklistTemplateId }>;
}) {
  const [checklists, setChecklists] = useState<Checklist[]>();
  useEffect(() => {
    const action = async () => {
      setChecklists(await getChecklists((await params).templateId));
    };
    action();
  }, [params]);

  function Checklists() {
    return (
      <ul className="list-disc">
        {checklists?.map((checklist) => (
          <li key={checklist.id}>
            <Link href={`/checklists/checklist/${checklist.id}/get`}>
              {checklist.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div>
      <Checklists />
    </div>
  );
}
