export function Loading({ message = "Carregando..." }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm shadow-black/30">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        {message}
      </div>
    </div>
  );
}
