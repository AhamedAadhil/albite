// utils/isAvailableNow.ts
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

/**
 * Returns true if current local time is before-or-equal to `availableBefore`.
 * Accepts:
 *  - full ISO/date-time strings (e.g. "2025-08-10T23:55:00Z")
 *  - date-like strings (e.g. "2025-08-10 23:55")
 *  - time-only strings (e.g. "23:55")
 *  - Date objects
 *
 * If input is missing / invalid, defaults to true (available).
 */
export function isAvailableNow(availableBefore?: string | Date | null) {
  if (!availableBefore) return true;

  const now = dayjs();

  // If it's already a Date object, parse directly
  if (availableBefore instanceof Date) {
    const parsed = dayjs(availableBefore);
    return now.isBefore(parsed) || now.isSame(parsed);
  }

  const s = String(availableBefore).trim();

  // time-only format "HH:mm" OR "H:mm"
  const timeOnlyMatch = /^\d{1,2}:\d{2}$/.test(s);
  if (timeOnlyMatch) {
    const [hh, mm] = s.split(":").map((v) => parseInt(v, 10));
    // build today at hh:mm (local time)
    const availableUntil = now.hour(hh).minute(mm).second(0).millisecond(0);
    return now.isBefore(availableUntil) || now.isSame(availableUntil);
  }

  // Try parsing as full datetime or other formats
  const parsed = dayjs(s);
  if (parsed.isValid()) {
    return now.isBefore(parsed) || now.isSame(parsed);
  }

  // try a common fallback format (e.g. "YYYY-MM-DD HH:mm")
  const parsed2 = dayjs(s, "YYYY-MM-DD HH:mm", true);
  if (parsed2.isValid()) {
    return now.isBefore(parsed2) || now.isSame(parsed2);
  }

  // if still invalid, assume available (safe fallback)
  return true;
}
