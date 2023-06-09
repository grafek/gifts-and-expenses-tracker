export const MONTHS = [
  // "All Months",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const YEARS = [
  // "All Years",
  "2023",
  "2024",
  "2025",
  "2026",
];

export const LONG_DATETIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export const LONG_MONTHS_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
});
