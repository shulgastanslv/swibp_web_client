/** Comma-separated inbox list in ADMIN_EMAILS. Those accounts become admins on sign-in. */
export function emailIsAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const wanted = email.trim().toLowerCase();
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .includes(wanted);
}
