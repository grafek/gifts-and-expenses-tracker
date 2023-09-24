export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const YEARS = ["2023", "2024", "2025", "2026"];

export const CURRENT_YEAR = new Date().getFullYear().toString();
export const CURRENT_MONTH = new Date().toLocaleString("default", {
  month: "short",
});

export const DATETIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export const LONG_MONTHS_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
});
