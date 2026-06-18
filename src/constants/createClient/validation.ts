import * as Yup from "yup";
import { hasContactInput } from "@/constants/createClient/utils";

export function requiredWhenContactStarted(message: string) {
  return Yup.string().test("contact-group", message, function (value) {
    if (!hasContactInput(this.parent)) return true;
    return String(value ?? "").trim() !== "";
  });
}

export const createClientValidationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Company name is required"),
  legalName: Yup.string().trim().required("Legal name is required"),
  industry: Yup.string().trim().required("Industry is required"),
  website: Yup.string()
    .trim()
    .url("Invalid website URL")
    .required("Website is required"),
  city: Yup.string().trim().required("City is required"),
  state: Yup.string().trim().required("State is required"),
  pincode: Yup.string()
    .trim()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Pincode must be 6 digits"),
  gstin: Yup.string()
    .trim()
    .transform((value) => value?.toUpperCase())
    .required("GSTIN is required")
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
      "Invalid GSTIN format",
    ),
  // status: Yup.string().required("Status is required"),
  // tier: Yup.string().required("Tier is required"),
  // fleetSize: Yup.number().required("Fleet size is required"),
  // mrr: Yup.number().required("MRR is required"),
  // notes: Yup.string().required("Notes are required"),
  // contactName: requiredWhenContactStarted("Contact name is required"),
  // contactRole: requiredWhenContactStarted("Contact role is required"),
  // contactEmail: requiredWhenContactStarted("Contact email is required").email(
  //   "Invalid email",
  // ),
  // contactPhone: requiredWhenContactStarted("Contact phone is required"),
});
