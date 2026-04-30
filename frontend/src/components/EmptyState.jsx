export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950/35 px-4 py-8 text-center">
      <p className="text-sm font-semibold text-slate-100">{title}</p>
      {description && (
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
