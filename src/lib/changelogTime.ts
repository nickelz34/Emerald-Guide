/** America/Chicago wall-clock used for changelog release timestamps. */
export const CHANGELOG_TIME_ZONE = "America/Chicago";

/**
 * Format a moment as an ISO-8601 datetime with the Central Time offset
 * (CST/CDT), e.g. `2026-07-17T17:04:15-05:00`.
 */
export function formatCentralIsoDateTime(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CHANGELOG_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZoneName: "longOffset",
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const offsetRaw = get("timeZoneName").replace(/^GMT/, "");
  const offset = offsetRaw === "" || offsetRaw === "Z" ? "+00:00" : offsetRaw;
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}${offset}`;
}

/** Display changelog timestamps in Central Time (`America/Chicago`). */
export function formatChangelogReleaseDate(iso: string): string {
  if (!iso.includes("T")) {
    const [year, month, day] = iso.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const instant = new Date(iso);
  if (Number.isNaN(instant.getTime())) return iso;

  const datePart = instant.toLocaleDateString("en-US", {
    timeZone: CHANGELOG_TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timePart = instant.toLocaleTimeString("en-US", {
    timeZone: CHANGELOG_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart}, ${timePart} CT`;
}
