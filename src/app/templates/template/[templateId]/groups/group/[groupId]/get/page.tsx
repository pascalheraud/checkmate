"use client";
import { getGroupsWithItems } from "@/model/db/template/group";
import { deleteTemplateItem } from "@/model/db/template/item";
import {
  ChecklistTemplateGroupId,
  ChecklistTemplateGroupWithItems,
  ChecklistTemplateItem,
} from "@/model/model";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Group({
  params,
}: {
  params: Promise<{ templateId: number; groupId: ChecklistTemplateGroupId }>;
}) {
  const [group, setGroup] = useState<ChecklistTemplateGroupWithItems>();
  const [templateId, setTemplateId] = useState<number>();
  useEffect(() => {
    const action = async () => {
      setTemplateId((await params).templateId);
      setGroup(await getGroupsWithItems((await params).groupId));
    };
    action();
  }, [params]);

  function ItemList({ items }: { items: ChecklistTemplateItem[] }) {
    return items.map((item: ChecklistTemplateItem) => (
      <li key={item.id}>
        Name: {item.name}
        &nbsp;
        <Link href={`/templates/template/${group!.id}/groups/group/${item.id}/items/item/${item.id}/get`}>Voir</Link>
        &nbsp;
        <button
          onClick={async () => {
            const items = await deleteTemplateItem(group!.id, item.id);
            setGroup({ ...group!, items: items });
          }}
        >
          Suppr
        </button>
      </li>
    ));
  }

  function Items() {
    if (group) {
      return (
        <span>
          <ul className="list-disc">
            <ItemList items={group.items} />
          </ul>
          <Link href={`/templates/template/${templateId}/groups/group/${group.id}/items/new`}>
            New item
          </Link>
        </span>
      );
    } else return;
  }

  return (
    <div>
      <h1>Group details {group?.name}</h1>
      <br />
      <Items />
    </div>
  );
}
