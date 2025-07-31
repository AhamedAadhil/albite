// Helper for initials
function getInitials(name: string = ""): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default getInitials;
