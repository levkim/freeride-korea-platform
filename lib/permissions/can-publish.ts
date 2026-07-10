export function canPublish(role: "admin" | "member") {
  return role === "admin";
}
