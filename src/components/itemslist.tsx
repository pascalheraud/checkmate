"use client";
import { IdentifiedNamed } from "@/model/db/db";
import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Link from "next/link";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

interface ItemsListProps<T extends IdentifiedNamed<T>> {
  children?: (item: T) => React.ReactNode;
  deleteItem(item: T): Promise<void>;
  items: T[];
  viewLink(item: T): string;
  newLink: string;
  isDeletable(item: T): boolean;
  modalLabel: string;
  itemsLabel: string;
  unremovableTitle: string;
  removableTitle: string;
  newLabel: string;
}

export default function ItemsList<T extends IdentifiedNamed<T>>({
  children,
  deleteItem: deletItem,
  items,
  viewLink,
  newLink,
  isDeletable,
  modalLabel,
  itemsLabel,
  unremovableTitle,
  removableTitle,
  newLabel,
}: ItemsListProps<T>) {
  const [removeModal, setRemoveModal] = useState(false);

  function Items() {
    return items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>
          <ButtonGroup>
            <Button href={viewLink(item)} color="info" size="xs">
              <FaMagnifyingGlass className="mr-2 h-5 w-5" />
              View
            </Button>
            {children ? children(item) : null}
            <Button
              className={
                !isDeletable(item) ? "opacity-50 cursor-not-allowed" : ""
              }
              onClick={async () => {
                if (isDeletable(item)) {
                  await deletItem(item);
                } else {
                  setRemoveModal(true);
                }
              }}
              color="failure"
              size="xs"
              title={!isDeletable(item) ? unremovableTitle : removableTitle}
            >
              Remove
            </Button>
            <Modal
              show={removeModal}
              size="md"
              popup
              onClose={() => setRemoveModal(false)}
            >
              <ModalHeader />
              <ModalBody>
                {" "}
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    {modalLabel}
                  </h3>
                </div>
              </ModalBody>
            </Modal>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    ));
  }

  return (
    <div>
      <Table>
        <TableHead>
          <TableHeadCell>{itemsLabel}</TableHeadCell>
          <TableHeadCell></TableHeadCell>
        </TableHead>
        <Table.Body className="divide-y">
          <Items />
        </Table.Body>
      </Table>
      <Button as={Link} href={newLink} color="blue" size="xs">
        {newLabel}
      </Button>
    </div>
  );
}
