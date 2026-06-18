import { contactValidationSchema } from "@/constants/client-detail-validation";
import type { ContactFormValues } from "@/types/client-detail";
import { FormField } from "@/components/ui";
import { useFormik } from "formik";
import { usePostApi } from "@/hooks/usePostApi";

type AddContactFormProps = {
  clientId: string;
  onAdded: () => void;
  disabled?: boolean;
};

export function AddContactForm({
  clientId,
  onAdded,
  disabled,
}: AddContactFormProps) {
  const { action: addContact, loading: addContactLoading } = usePostApi<
    unknown,
    unknown
  >({
    path: "/contacts/create",
    onSuccess: () => {
      onAdded();
    },
    onError: (error) => {
      console.error(error);
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
  } = useFormik<ContactFormValues>({
    initialValues: {
      name: "",
      role: "",
      email: "",
      phone: "",
    },
    validationSchema: contactValidationSchema,
    onSubmit: (formValues) => {
      if (disabled || addContactLoading) return;
      addContact({
        clientId: +clientId,
        name: formValues.name.trim(),
        role: formValues.role.trim(),
        email: formValues.email.trim(),
        phone: formValues.phone.trim(),
      });
      resetForm();
    },
  });

  return (
    <form
      className="space-y-2 border-t border-slate-100 bg-slate-50 px-5 py-4"
      onSubmit={handleSubmit}
    >
      <FormField
        label="Name *"
        name="name"
        error={errors.name}
        touched={touched.name}
      >
        <input
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Name"
          disabled={disabled || addContactLoading}
        />
      </FormField>
      <div className="grid grid-cols-2 gap-2">
        <FormField
          label="Role *"
          name="role"
          error={errors.role}
          touched={touched.role}
        >
          <input
            value={values.role}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Role"
            disabled={disabled || addContactLoading}
          />
        </FormField>
        <FormField
          label="Phone *"
          name="phone"
          error={errors.phone}
          touched={touched.phone}
        >
          <input
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Phone"
            disabled={disabled || addContactLoading}
          />
        </FormField>
      </div>
      <FormField
        label="Email *"
        name="email"
        error={errors.email}
        touched={touched.email}
      >
        <input
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
          disabled={disabled || addContactLoading}
        />
      </FormField>
      <button
        type="submit"
        className="btn-primary w-full disabled:opacity-50"
        disabled={disabled || addContactLoading}
      >
        {addContactLoading ? "Adding…" : "Add contact"}
      </button>
    </form>
  );
}
