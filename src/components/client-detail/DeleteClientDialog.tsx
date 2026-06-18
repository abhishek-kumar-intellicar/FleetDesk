import { Loader } from "@/components/ui";

type DeleteClientDialogProps = {
  clientName: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteClientDialog({
  clientName,
  loading,
  onCancel,
  onConfirm,
}: DeleteClientDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        aria-label="Close dialog"
        onClick={onCancel}
      />
      <div
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-client-title"
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80">
            <Loader label="Deleting client…" />
          </div>
        )}
        <h2
          id="delete-client-title"
          className="text-lg font-semibold text-slate-900"
        >
          Delete client?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          This will permanently delete{" "}
          <span className="font-medium text-slate-900">{clientName}</span> and
          all related records. This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="btn-ghost"
            disabled={loading}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-50"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
