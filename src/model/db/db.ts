"use server";
import postgres from "postgres";
import { ID } from "../model";

export const sql = postgres(
  "postgres://checkmate:checkmate@localhost:5432/checkmate",
  {
    transform: postgres.toCamel,
  }
);

export interface Identified<T> {
  id: ID<T>;
}

export async function createDBObject<T extends Identified<T>>(
  source: Promise<Identified<T>[]>,
  obj: T
): Promise<T> {
  const created = await source;
  obj.id = created[0].id;
  return obj;
}

export async function getDBObject<T>(source: Promise<T[]>): Promise<T> {
  const values: T[] = await source;
  if (!values.length) throw new Error("Not found");
  return values[0];
}
