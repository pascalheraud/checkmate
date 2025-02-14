"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TemplateId } from "@/model/model";
import { createChecklist } from "@/model/db/checklist/checklist";
import { getTemplate } from "@/model/db/template/template";

export default function ChecklistIntanciate({
  params,
}: {
  params: Promise<{ templateId: TemplateId }>;
}) {
  const [name, setName] = useState("");
  const router = useRouter();
  useEffect(() => {
    const action = async () => {
      const template = await getTemplate((await params).templateId);
      setName("Instance de " + template.name);
    };
    action();
  }, [params]);

  async function create() {
    const checklist = await createChecklist((await params).templateId, name);
    router.push(`/checklists/checklist/${checklist.id}/get`);
  }

  return (
    <form>
      Nom :{" "}
      <input
        placeholder="nom"
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input type="button" onClick={create} value="GO" />
    </form>
  );
}
