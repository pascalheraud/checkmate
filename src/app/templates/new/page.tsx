"use client";
import { useState } from "react";
import { createChecklistTemplate } from "@/model/db/template/template";
import { useRouter } from "next/navigation";

export default function NewTemplate() {
  const [name, setName] = useState("");
  const router = useRouter();

  async function create() {
    await createChecklistTemplate({ name: name });
    router.push("/");
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
