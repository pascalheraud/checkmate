"use client";
import { FormEvent, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";

interface NameFormProps {
  onSubmit: (name: string) => void;
  placeHolder: string;
  label: string;
  submit: string;
  children?: React.ReactNode;
}

export default function NameForm({
  onSubmit,
  placeHolder,
  label,
  submit,
  children,
}: NameFormProps) {
  const [name, setName] = useState("");

  async function create(e: FormEvent) {
    e.preventDefault();
    onSubmit(name);
  }

  return (
    <form className="flex max-w-md flex-col gap-4" onSubmit={create}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="name" value={label} />
        </div>
        <TextInput
          id="name"
          type="text"
          placeholder={placeHolder}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {children ? children : null}
      <Button type="submit" color="blue">
        {submit}
      </Button>
    </form>
  );
}
