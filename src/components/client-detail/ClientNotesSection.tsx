type ClientNotesSectionProps = {
  notes: string;
};

export function ClientNotesSection({ notes }: ClientNotesSectionProps) {
  return (
    <div className="card p-5">
      <h2 className="mb-2 text-sm font-semibold text-slate-900">Notes</h2>
      <p className="text-sm leading-relaxed text-slate-600">{notes}</p>
    </div>
  );
}
