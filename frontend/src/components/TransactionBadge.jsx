import { formatTransactionType } from "../utils/formatters";

export function TransactionBadge({ type }) {
  const className =
    type === "INCOME"
      ? "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25"
      : "bg-rose-400/10 text-rose-300 ring-rose-400/25";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ring-1 ${className}`}
    >
      {formatTransactionType(type)}
    </span>
  );
}
