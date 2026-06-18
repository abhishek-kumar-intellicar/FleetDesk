type ClientDangerZoneProps = {
  onDeleteClick: () => void;
};

export function ClientDangerZone({ onDeleteClick }: ClientDangerZoneProps) {
  return (
    <div className="card p-5">
      <h2 className="text-sm font-semibold text-slate-900">Danger zone</h2>
      <p className="mt-1 text-xs text-slate-500">
        Permanently delete this client and all related records.
      </p>
      <button
        type="button"
        className="btn mt-3 w-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
        onClick={onDeleteClick}
      >
        Delete client
      </button>
    </div>
  );
}
