"use client";
import { ChecklistTemplate } from "@/model/model";
import {
  deleteChecklistTemplate,
  getAllChecklistTemplates,
} from "@/model/db/template/template";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  useEffect(() => {
    const action = async () => {
      setTemplates(await getAllChecklistTemplates());
    };
    action();
  }, []);

  function TemplateList() {
    return templates.map((template: ChecklistTemplate) => (
      <li key={template.id}>
        {template.name}
        &nbsp;
        <Link href={`/templates/template/${template.id}/get`}>Voir</Link>
        &nbsp;
        <Link href={`/templates/template/${template.id}/instantiate`}>
          Instancier
        </Link>
        &nbsp;
        <Link href={`/templates/template/${template.id}/instances`}>
          Instances
        </Link>
        &nbsp;
        <button
          onClick={async () => {
            setTemplates(await deleteChecklistTemplate(template.id));
          }}
        >
          Suppr
        </button>
      </li>
    ));
  }

  function Templates() {
    return (
      <div>
        <ul className="list-disc">
          <TemplateList />
        </ul>
      </div>
    );
  }

  return (
    <div>
      Liste des templates :
      <Templates />
      <Link href="/templates/new">Nouveau template</Link>
    </div>
  );
}
