/** Policy of 009: block only admin-loss. Concurrent demotions of two admins still need a DB lock. */
export type LastAdminOperation = "delete_admin" | "demote_admin" | "delete_user" | "update_user";

export function wouldRemoveLastAdmin(
  otherAdminCount: number,
  operation: LastAdminOperation,
) {
  if (operation === "delete_user" || operation === "update_user") return false;
  return otherAdminCount < 1;
}
