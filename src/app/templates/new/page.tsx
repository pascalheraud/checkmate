"use client";
import NameForm from "@/components/nameform";
import { createTemplate } from "@/model/db/template/template";
import { useRouter } from "next/navigation";

export default function NewTemplate() {
  const router = useRouter();

  async function create(name: string) {
    await createTemplate({ name: name });
    router.push("/");
  }

  return (
    <NameForm
      label="Template name"
      placeHolder="Awesome template name"
      submit="Create template"
      onSubmit={create}
    />
  );
}
