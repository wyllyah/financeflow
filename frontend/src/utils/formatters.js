function getStoredCurrency() {
  if (typeof window === "undefined") {
    return "BRL";
  }

  return localStorage.getItem("@financeflow:currency") || "BRL";
}

export function formatCurrency(value, preferredCurrency) {
  const currency = preferredCurrency || getStoredCurrency();
  const locales = {
    BRL: "pt-BR",
    USD: "en-US",
    EUR: "de-DE",
  };

  return new Intl.NumberFormat(locales[currency] || "pt-BR", {
    style: "currency",
    currency,
  }).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatTransactionType(type) {
  const types = {
    INCOME: "Receita",
    EXPENSE: "Despesa",
  };

  return types[type] || type;
}
