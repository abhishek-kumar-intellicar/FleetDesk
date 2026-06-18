import moment from "moment";
import { hasContactInput } from "@/constants/createClient/utils";
import type {
  CreateClientFormValues,
  CreateClientPayload,
} from "@/types/createClient";

export function buildCreateClientPayload(
  values: CreateClientFormValues,
): CreateClientPayload {
  const payload: CreateClientPayload = {
    name: values.name.trim(),
    legalName: values.legalName.trim(),
    industry: values.industry.trim(),
    status: values.status || "lead",
    tier: values.tier || "standard",
    city: values.city.trim(),
    state: values.state.trim(),
    pincode: values.pincode.trim(),
    gstin: values.gstin.trim().toUpperCase(),
    fleetSize: values.fleetSize ? Number(values.fleetSize) : 0,
    mrr: values.mrr ? Number(values.mrr) : 0,
    website: values.website.trim(),
  };

  const leadSource = values.leadSource.trim();
  if (leadSource) payload.leadSource = leadSource;

  const assignedToId = values.assignedToId.trim();
  if (assignedToId) payload.assignedToId = assignedToId;

  const notes = values.notes.trim();
  if (notes) payload.notes = notes;

  if (values.renewalAt) {
    payload.renewalAt = moment(values.renewalAt, "YYYY-MM-DD")
      .startOf("day")
      .valueOf();
  }

  if (hasContactInput(values)) {
    payload.primaryContact = {
      name: values.contactName.trim(),
      role: values.contactRole.trim(),
      email: values.contactEmail.trim(),
      phone: values.contactPhone.trim(),
    };
  }

  return payload;
}
