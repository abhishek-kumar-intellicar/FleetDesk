import * as Yup from "yup";
import { ACTIVITY_TYPES } from "@/constants/activity";

export const contactValidationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  role: Yup.string().trim().required("Role is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
  phone: Yup.string().trim().required("Phone is required"),
});

export const activityValidationSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(ACTIVITY_TYPES, "Select a valid activity type")
    .required("Type is required"),
  summary: Yup.string()
    .trim()
    .required("Summary is required")
    .min(3, "Summary must be at least 3 characters")
    .max(500, "Summary must be at most 500 characters"),
});
