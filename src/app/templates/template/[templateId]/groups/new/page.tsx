"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTemplateGroup } from "@/model/db/template/group";
import { ChecklistTemplateId } from "@/model/model";

export default function NewGroup({
  params,
}: {
  params: Promise<{ templateId: ChecklistTemplateId }>;
}) {
  const [name, setName] = useState("");
  const router = useRouter();

  async function create() {
    await createTemplateGroup((await params).templateId, { name: name });
    router.push(`/templates/template/${(await params).templateId}/get`);
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
