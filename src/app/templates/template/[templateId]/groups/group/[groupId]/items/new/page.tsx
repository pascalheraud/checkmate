"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTemplateItem } from "@/model/db/template/item";

export default function NewItem({
  params,
}: {
  params: Promise<{ templateId: number, groupId: number }>;
}) {
  const [name, setName] = useState("");
  const router = useRouter();

  async function create() {
    const paramValues= await params;
    await createTemplateItem(paramValues.groupId, { name: name });
    router.push(`/templates/template/${paramValues.templateId}/groups/group/${paramValues.groupId}/get`);
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
