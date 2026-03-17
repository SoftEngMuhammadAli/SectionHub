const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const compact = new Intl.NumberFormat("en-US", { notation: "compact" });
const fullDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
export function formatPrice(cents) {
  return money.format((cents ?? 0) / 100);
}
export function formatCount(value) {
  return compact.format(value);
}
export function formatDate(value) {
  return value ? fullDate.format(new Date(value)) : "-";
}
export function toId(value) {
  return String(value);
}
