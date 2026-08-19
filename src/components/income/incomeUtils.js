export const ALLOWED_INCOME_ROLES = ["admin", "sub_admin", "super_admin"];
export const CURRENCIES = ["BDT", "INR"];

const CURRENCY_LOCALES = { BDT: "bn-BD", INR: "en-IN" };

export function formatIncome(value, currency = "BDT") {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(CURRENCY_LOCALES[currency] || "en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatIncomeDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

export function getEntityLabel(entity, fields = []) {
  if (!entity) return "—";
  if (typeof entity === "string") return entity;
  return fields.map((field) => entity[field]).find(Boolean) || entity._id || "—";
}
