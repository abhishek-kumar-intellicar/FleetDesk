import type { ActivityType } from "@/types";

export type ContactFormValues = {
  name: string;
  role: string;
  email: string;
  phone: string;
};

export type ActivityFormValues = {
  type: ActivityType;
  summary: string;
};
