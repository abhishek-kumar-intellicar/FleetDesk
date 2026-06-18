export type CreateClientFormValues = {
  name: string;
  legalName: string;
  industry: string;
  website: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  status: string;
  tier: string;
  fleetSize: string;
  mrr: string;
  leadSource: string;
  renewalAt: string;
  assignedToId: string;
  notes: string;
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
};

export type CreateClientPayload = {
  name: string;
  legalName: string;
  industry: string;
  status: string;
  tier: string;
  city: string;
  state: string;
  pincode: string;
  fleetSize: number;
  mrr: number;
  website: string;
  gstin: string;
  leadSource?: string;
  renewalAt?: number;
  assignedToId?: string;
  notes?: string;
  primaryContact?: {
    name: string;
    role: string;
    email: string;
    phone: string;
  };
};

export type CreateClientContactValues = Pick<
  CreateClientFormValues,
  "contactName" | "contactRole" | "contactEmail" | "contactPhone"
>;
