// lib/dateFormat.js
//
// Deterministic date formatting for the archive.
//
// Date.prototype.toLocaleDateString() output depends on the ICU data that
// happens to be installed in the running environment. The server (Node on
// Vercel) and a browser with full ICU disagree about the Khmer locale's
// numbering system: Node renders "5 មករា 2026" while Chrome renders
// "៥ មករា ២០២៦". The server HTML and the first client render therefore
// differ, and React reports a hydration mismatch. Formatting from fixed data
// keeps both renders byte-for-byte identical while keeping the Khmer page in
// Khmer numerals.

// English month names, January → December.
const EN_MONTHS = [
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

// Khmer month names, January → December (CLDR `km`).
const KM_MONTHS = [
  "មករា",
  "កុម្ភៈ",
  "មីនា",
  "មេសា",
  "ឧសភា",
  "មិថុនា",
  "កក្កដា",
  "សីហា",
  "កញ្ញា",
  "តុលា",
  "វិច្ឆិកា",
  "ធ្នូ",
];

// Khmer digits 0-9.
const KM_DIGITS = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];

function toKhmerDigits(value) {
  return String(value).replace(/\d/g, (digit) => KM_DIGITS[Number(digit)]);
}

// Formats a submission timestamp for the review queue.
//   - Returns "" for missing or unparsable values, so a bad row never throws.
//   - Reads the fields in UTC, so the string does not depend on the server's
//     or the reader's local time zone.
//   - English: "January 5, 2026"; Khmer: "៥ មករា ២០២៦".
export function formatSubmittedDate(value, language) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  if (language === "km") {
    return `${toKhmerDigits(day)} ${KM_MONTHS[month]} ${toKhmerDigits(year)}`;
  }

  return `${EN_MONTHS[month]} ${day}, ${year}`;
}
