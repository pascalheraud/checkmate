"use client";
import ItemsList from "@/components/itemslist";
import {
  TemplateWithInfo,
  deleteTemplate,
  getAllTemplates,
} from "@/model/db/template/template";
import { Template } from "@/model/model";
import { Button } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function Home() {
  const [templates, setTemplates] = useState<TemplateWithInfo[]>([]);
  useEffect(() => {
    const action = async () => {
      setTemplates(await getAllTemplates());
    };
    action();
  }, []);

  async function deleteTemplateItem(template: TemplateWithInfo): Promise<void> {
    setTemplates(await deleteTemplate(template.id));
  }

  function isDeletableTemplate(template: TemplateWithInfo): boolean {
    return !template.hasInstances && !template.hasGroups;
  }

  return (
    <ItemsList
      viewLink={(template: TemplateWithInfo) =>
        `/templates/template/${template.id}/get`
      }
      newLink="/templates/new"
      items={templates as Template[]}
      deleteItem={deleteTemplateItem}
      itemsLabel="Templates"
      isDeletable={isDeletableTemplate}
      modalLabel="This template can't be removed since it has instance or group"
      removableTitle="Remove the template"
      newLabel="New Template"
      unremovableTitle="This template has at least one instance or group and cannot be removed"
    >
      {(template) => [
        <Button
          key="one"
          as={Link}
          href={`/templates/template/${template.id}/instantiate`}
          color="blue"
          size="xs"
        >
          <FaUserPlus className="mr-2 h-5 w-5" />
          Instanciate
        </Button>,
        <Button
          key="second"
          disabled={!(template as TemplateWithInfo).hasInstances}
          href={
            (template as TemplateWithInfo).hasInstances
              ? `/templates/template/${template.id}/instances`
              : undefined
          }
          color="info"
          size="xs"
          title={
            (template as TemplateWithInfo).hasInstances
              ? "View instances"
              : "This template has no instance"
          }
        >
          <FaMagnifyingGlass className="mr-2 h-5 w-5" />
          View Instances
        </Button>,
      ]}
    </ItemsList>
  );
}
