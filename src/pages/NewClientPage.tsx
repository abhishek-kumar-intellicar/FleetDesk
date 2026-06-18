import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { customers } from "@/lib/routes";
import { errorToast, successToast } from "@/lib/toast";
import { FormField, PageHeader } from "@/components/ui";
import { usePostApi } from "@/hooks/usePostApi";
import { buildCreateClientPayload } from "@/constants/createClient/build-payload";
import { CREATE_CLIENT_INITIAL_VALUES } from "@/constants/createClient/initial-values";
import { createClientValidationSchema } from "@/constants/createClient/validation";
import type {
  CreateClientFormValues,
  CreateClientPayload,
} from "@/types/createClient";

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
    },
    onError: (error) => {
      errorToast(error.message || "Failed to create client");
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik<CreateClientFormValues>({
      initialValues: CREATE_CLIENT_INITIAL_VALUES,
      validationSchema: createClientValidationSchema,
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
              disabled={createClientLoading}
            >
              Create client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
