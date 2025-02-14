"use client";
import NameForm from "@/components/nameform";
import { createTemplateItem } from "@/model/db/template/item";
import { TemplateGroupId, TemplateId } from "@/model/model";
import { useRouter } from "next/navigation";

export default function NewItem({
  params,
}: {
  params: Promise<{
    templateId: TemplateId;
    groupId: TemplateGroupId;
  }>;
}) {
  const router = useRouter();

  async function create(name: string) {
    const paramValues = await params;
    await createTemplateItem(paramValues.groupId, { name: name });
    router.push(
      `/templates/template/${paramValues.templateId}/groups/group/${paramValues.groupId}/get`
    );
  }

  return (
    <NameForm
      label="Item name"
      placeHolder="Awesome item name"
      submit="Add item"
      onSubmit={create}
    >
      <span>Will show status options here</span>
    </NameForm>
  );
}
