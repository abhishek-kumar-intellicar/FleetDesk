import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { customers } from "@/lib/routes";
import { errorToast, successToast } from "@/lib/toast";
import { FormField, PageHeader } from "@/components/ui";
import { usePostApi } from "@/hooks/usePostApi";

type FormValues = {
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

type CreateClientPayload = {
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

function buildCreateClientPayload(values: FormValues): CreateClientPayload {
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
    payload.renewalAt = new Date(values.renewalAt).getTime();
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

type ContactValues = Pick<
  FormValues,
  "contactName" | "contactRole" | "contactEmail" | "contactPhone"
>;

function hasContactInput(values: ContactValues) {
  return [
    values.contactName,
    values.contactRole,
    values.contactEmail,
    values.contactPhone,
  ].some((value) => String(value ?? "").trim() !== "");
}

function requiredWhenContactStarted(message: string) {
  return Yup.string().test("contact-group", message, function (value) {
    if (!hasContactInput(this.parent)) return true;
    return String(value ?? "").trim() !== "";
  });
}

const validationSchema = Yup.object().shape({
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

export default function NewClientPage() {
  const navigate = useNavigate();
  const { action: createClient, loading: createClientLoading } = usePostApi<
    CreateClientPayload,
    unknown
  >({
    path: `client/create`,
    onSuccess: () => {
      successToast("Client created successfully");
      navigate(customers.clients);
      // router.refresh();
    },
    onError: (error) => {
      errorToast(error.message || "Failed to create client");
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormik<FormValues>({
    initialValues: {
      name: "",
      legalName: "",
      industry: "",
      website: "",
      city: "",
      state: "",
      pincode: "",
      gstin: "",
      status: "",
      tier: "",
      fleetSize: "",
      mrr: "",
      leadSource: "",
      renewalAt: "",
      assignedToId: "",
      notes: "",
      contactName: "",
      contactRole: "",
      contactEmail: "",
      contactPhone: "",
    },
    validationSchema,
    onSubmit: (formValues) => {
      createClient(buildCreateClientPayload(formValues));
    },
  });

  return (
    <div>
      <PageHeader
        title="New Client"
        subtitle="Add a telematics account to your portfolio"
      />

      <div className="p-8">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl space-y-6"
          noValidate
        >
          <div className="card p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Company
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                className="sm:col-span-2"
                label="Company name *"
                name="name"
                error={errors.name}
                touched={touched.name}
              >
                <input
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Tata Logistics"
                />
              </FormField>

              <FormField
                className="sm:col-span-2"
                label="Legal name *"
                name="legalName"
                error={errors.legalName}
                touched={touched.legalName}
              >
                <input
                  value={values.legalName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Acme Logistics Pvt Ltd"
                />
              </FormField>

              <FormField
                label="Industry *"
                name="industry"
                error={errors.industry}
                touched={touched.industry}
              >
                <input
                  value={values.industry}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Courier & Logistics"
                />
              </FormField>

              <FormField
                label="Website *"
                name="website"
                error={errors.website}
                touched={touched.website}
              >
                <input
                  value={values.website}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://…"
                />
              </FormField>

              <FormField
                label="City *"
                name="city"
                error={errors.city}
                touched={touched.city}
              >
                <input
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Bengaluru"
                />
              </FormField>

              <FormField
                label="State *"
                name="state"
                error={errors.state}
                touched={touched.state}
              >
                <input
                  value={values.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Karnataka"
                />
              </FormField>

              <FormField
                label="Pincode *"
                name="pincode"
                error={errors.pincode}
                touched={touched.pincode}
              >
                <input
                  value={values.pincode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. 560001"
                />
              </FormField>

              <FormField
                label="GSTIN *"
                name="gstin"
                error={errors.gstin}
                touched={touched.gstin}
              >
                <input
                  value={values.gstin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. 29AABCU9603R1ZM"
                />
              </FormField>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Account
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Status"
                name="status"
                error={errors.status}
                touched={touched.status}
              >
                <select
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select Status</option>
                  <option value="lead">Lead</option>
                  <option value="active">Active</option>
                  <option value="churned">Churned</option>
                </select>
              </FormField>

              <FormField
                label="Tier"
                name="tier"
                error={errors.tier}
                touched={touched.tier}
              >
                <select
                  value={values.tier}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select Tier</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </FormField>

              <FormField
                label="Fleet size (vehicles)"
                name="fleetSize"
                error={errors.fleetSize}
                touched={touched.fleetSize}
              >
                <input
                  type="number"
                  min="0"
                  value={values.fleetSize}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0"
                />
              </FormField>

              <FormField
                label="MRR (₹ / month)"
                name="mrr"
                error={errors.mrr}
                touched={touched.mrr}
              >
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={values.mrr}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0"
                />
              </FormField>

              <FormField
                label="Lead source"
                name="leadSource"
                error={errors.leadSource}
                touched={touched.leadSource}
              >
                <select
                  value={values.leadSource}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select source</option>
                  <option value="inbound">Inbound</option>
                  <option value="outbound">Outbound</option>
                  <option value="referral">Referral</option>
                  <option value="partner">Partner</option>
                  <option value="event">Event</option>
                  <option value="other">Other</option>
                </select>
              </FormField>

              <FormField
                label="Renewal date"
                name="renewalAt"
                error={errors.renewalAt}
                touched={touched.renewalAt}
              >
                <input
                  type="date"
                  value={values.renewalAt}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormField>

              <FormField
                className="sm:col-span-2"
                label="Assigned to (user id)"
                name="assignedToId"
                error={errors.assignedToId}
                touched={touched.assignedToId}
              >
                <input
                  value={values.assignedToId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. user-123"
                />
              </FormField>

              <FormField
                className="sm:col-span-2"
                label="Notes"
                name="notes"
                error={errors.notes}
                touched={touched.notes}
              >
                <textarea
                  rows={3}
                  value={values.notes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Context, requirements, next steps…"
                />
              </FormField>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Primary contact{" "}
              <span className="font-normal normal-case text-slate-400">
                (optional)
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Name"
                name="contactName"
                error={errors.contactName}
                touched={touched.contactName}
              >
                <input
                  value={values.contactName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Full name"
                />
              </FormField>

              <FormField
                label="Role"
                name="contactRole"
                error={errors.contactRole}
                touched={touched.contactRole}
              >
                <input
                  value={values.contactRole}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Fleet Manager"
                />
              </FormField>

              <FormField
                label="Email"
                name="contactEmail"
                error={errors.contactEmail}
                touched={touched.contactEmail}
              >
                <input
                  type="email"
                  value={values.contactEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="name@company.com"
                />
              </FormField>

              <FormField
                label="Phone"
                name="contactPhone"
                error={errors.contactPhone}
                touched={touched.contactPhone}
              >
                <input
                  value={values.contactPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+91 …"
                />
              </FormField>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link to={customers.clients} className="btn-ghost">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn-primary"
              // disabled={isSubmitting || createClientLoading}
            >
              Create client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
