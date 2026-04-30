export function ErrorMessage({ title = "Algo deu errado", message }) {
  return (
    <div className="rounded-xl border border-rose-400/30 bg-rose-950/35 p-4 text-sm text-rose-200">
      <p className="font-semibold">{title}</p>
      {message && <p className="mt-1 text-rose-300">{message}</p>}
    </div>
  );
}
