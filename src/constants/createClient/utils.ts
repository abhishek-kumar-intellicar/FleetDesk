import type { CreateClientContactValues } from "@/types/createClient";

export function hasContactInput(values: CreateClientContactValues) {
  return [
    values.contactName,
    values.contactRole,
    values.contactEmail,
    values.contactPhone,
  ].some((value) => String(value ?? "").trim() !== "");
}
