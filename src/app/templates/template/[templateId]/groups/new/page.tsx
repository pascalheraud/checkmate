"use client";
import NameForm from "@/components/nameform";
import { createTemplateGroup } from "@/model/db/template/group";
import { TemplateId } from "@/model/model";
import { useRouter } from "next/navigation";

export default function NewGroup({
  params,
}: {
  params: Promise<{ templateId: TemplateId }>;
}) {
  const router = useRouter();

  async function create(name: string) {
    await createTemplateGroup((await params).templateId, { name: name });
    router.push(`/templates/template/${(await params).templateId}/get`);
  }

  return (
    <NameForm
      label="Group name"
      placeHolder="Awesome group"
      submit="Create group"
      onSubmit={create}
    />
  );
}
