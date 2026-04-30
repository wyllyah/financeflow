export function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-3 h-1 w-10 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.45)]" />
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
