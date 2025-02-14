"use client";
import ItemsList from "@/components/itemslist";
import { getGroupsWithItems } from "@/model/db/template/group";
import { deleteTemplateItem } from "@/model/db/template/item";
import {
  TemplateGroupId,
  TemplateGroupWithItems,
  TemplateItem,
} from "@/model/model";
import { useEffect, useState } from "react";

export default function Group({
  params,
}: {
  params: Promise<{ templateId: number; groupId: TemplateGroupId }>;
}) {
  const [group, setGroup] = useState<TemplateGroupWithItems>();
  const [templateId, setTemplateId] = useState<number>();
  useEffect(() => {
    const action = async () => {
      setTemplateId((await params).templateId);
      setGroup(await getGroupsWithItems((await params).groupId));
    };
    action();
  }, [params]);

  async function deleteItem(item: TemplateItem): Promise<void> {
    const items = await deleteTemplateItem(group!.id, item.id);
    setGroup({ ...group!, items: items });
  }

  function Items() {
    if (group) {
      return (
        <ItemsList
          viewLink={(item: TemplateItem) =>
            `/templates/template/${templateId}/groups/group/${
              group!.id
            }/items/item/${item.id}/get`
          }
          newLink={`/templates/template/${templateId}/groups/group/${
            group!.id
          }/items/new`}
          items={group!.items}
          deleteItem={deleteItem}
          itemsLabel={`Group "${group.name}" Items`}
          isDeletable={() => true}
          modalLabel=""
          removableTitle="Remove the item"
          newLabel="New Item"
          unremovableTitle=""
        />
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
