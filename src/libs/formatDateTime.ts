export function formatDateTime(isoDateStr: string): string {
  const dateObj = new Date(isoDateStr);
  if (isNaN(dateObj.getTime())) return isoDateStr; // fallback to input if invalid

  const day = dateObj.getDate(); // 1-31
  const monthNames = [
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
  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();

  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // Handle midnight and noon

  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  const timeFormatted = `${hours
    .toString()
    .padStart(2, "0")}.${minutesStr} ${ampm}`;

  return `${day} ${month} ${year} at ${timeFormatted}`;
}
