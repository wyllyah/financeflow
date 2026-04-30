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
  const amount = Number(value);

  return new Intl.NumberFormat(locales[currency] || "pt-BR", {
    style: "currency",
    currency,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function parseCurrencyInput(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const rawValue = String(value || "").trim();

  if (!rawValue) {
    return 0;
  }

  const sanitizedValue = rawValue.replace(/[^\d,.-]/g, "");
  const lastCommaIndex = sanitizedValue.lastIndexOf(",");
  const lastDotIndex = sanitizedValue.lastIndexOf(".");
  let normalizedValue = sanitizedValue;

  if (lastCommaIndex >= 0 && lastDotIndex >= 0) {
    const decimalSeparator = lastCommaIndex > lastDotIndex ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";

    normalizedValue = sanitizedValue
      .replaceAll(thousandsSeparator, "")
      .replace(decimalSeparator, ".");
  } else if (lastCommaIndex >= 0) {
    normalizedValue = sanitizedValue.replaceAll(".", "").replace(",", ".");
  } else if ((sanitizedValue.match(/\./g) || []).length > 1) {
    const parts = sanitizedValue.split(".");
    const decimalPart = parts.at(-1);

    normalizedValue =
      decimalPart.length <= 2
        ? `${parts.slice(0, -1).join("")}.${decimalPart}`
        : parts.join("");
  } else if (lastDotIndex >= 0) {
    const [integerPart, decimalPart] = sanitizedValue.split(".");

    normalizedValue =
      decimalPart?.length === 3 && integerPart.length <= 3
        ? `${integerPart}${decimalPart}`
        : sanitizedValue;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
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
