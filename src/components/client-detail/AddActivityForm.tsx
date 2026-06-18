import { activityValidationSchema } from "@/constants/client-detail-validation";
import type { ActivityFormValues } from "@/types/client-detail";
import type {
  ActivityCreateParams,
  ActivityCreateResponse,
} from "@/types/api";
import { errorToast, successToast } from "@/lib/toast";
import { FormField } from "@/components/ui";
import { useFormik } from "formik";
import { usePostApi } from "@/hooks/usePostApi";

type AddActivityFormProps = {
  clientId: string;
  onAdded: () => void;
  disabled?: boolean;
};

export function AddActivityForm({
  clientId,
  onAdded,
  disabled,
}: AddActivityFormProps) {
  const { action: createActivity, loading: createActivityLoading } = usePostApi<
    ActivityCreateParams,
    ActivityCreateResponse
  >({
    path: "/activity/create",
    onSuccess: () => {
      successToast("Activity logged successfully");
      onAdded();
    },
    onError: (error) => {
      errorToast(error.message || "Failed to log activity");
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useFormik<ActivityFormValues>({
    initialValues: {
      type: "note",
      summary: "",
    },
    validationSchema: activityValidationSchema,
    onSubmit: (formValues) => {
      if (disabled || createActivityLoading) return;
      createActivity({
        clientid: +clientId,
        type: formValues.type,
        summary: formValues.summary.trim(),
      });
      resetForm();
    },
  });

  const isDisabled = disabled || createActivityLoading;

  return (
    <form
      className="space-y-2 border-b border-slate-100 px-5 py-4"
      onSubmit={handleSubmit}
    >
      <div className="flex gap-2">
        <FormField
          label="Type *"
          name="type"
          error={errors.type}
          touched={touched.type}
          className="!w-auto shrink-0"
        >
          <select
            name="type"
            value={values.type}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isDisabled}
            className="input !w-auto"
          >
            <option value="note">Note</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
          </select>
        </FormField>
        <FormField
          label="Summary *"
          name="summary"
          error={errors.summary}
          touched={touched.summary}
          className="min-w-0 flex-1"
        >
          <input
            name="summary"
            value={values.summary}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Log an interaction…"
            disabled={isDisabled}
            className="input"
          />
        </FormField>
      </div>
      <button
        type="submit"
        className="btn-primary w-full disabled:opacity-50"
        disabled={isDisabled}
      >
        {createActivityLoading ? "Logging…" : "Log activity"}
      </button>
    </form>
  );
}
