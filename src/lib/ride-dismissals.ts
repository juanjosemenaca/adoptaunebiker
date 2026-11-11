import { logServerError } from "@/lib/log";
import { getAuthContext } from "@/lib/supabase/auth-context";
import type { RideHides } from "@/lib/ride-helpers";

async function memberClient() {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) return null;
  return { supabase, user };
}

function hideFailed(label: string, error: { code?: string } | null) {
  if (!error) return;
  if (error.code === "42P01" || error.code === "PGRST205") return;
  logServerError(label, error);
}

export async function listRideHides(): Promise<RideHides> {
  const empty: RideHides = { dismissed: new Set(), purged: new Set() };
  const auth = await memberClient();
  if (!auth) return empty;
  const { data, error } = await auth.supabase
    .from("ride_dismissals")
    .select("ride_id, purged")
    .eq("user_id", auth.user.id);
  if (error) {
    hideFailed("[listRideHides]", error);
    return empty;
  }
  const hides: RideHides = { dismissed: new Set(), purged: new Set() };
  for (const row of data ?? []) {
    const id = String(row.ride_id ?? "");
    if (!id) continue;
    if (row.purged) hides.purged.add(id);
    else hides.dismissed.add(id);
  }
  return hides;
}

export async function saveRideDismissal(rideId: string, purged: boolean) {
  const auth = await memberClient();
  if (!auth) throw new Error("ride");
  const { error } = await auth.supabase.from("ride_dismissals").upsert({
    user_id: auth.user.id,
    ride_id: rideId,
    purged,
  });
  if (error) {
    hideFailed("[saveRideDismissal]", error);
    throw new Error("ride");
  }
}

export async function deleteRideRecord(rideId: string, hostId: string) {
  const auth = await memberClient();
  if (!auth) throw new Error("ride");
  const { error } = await auth.supabase
    .from("rides")
    .delete()
    .eq("id", rideId)
    .eq("host_id", hostId)
    .eq("status", "cancelled");
  if (error) {
    logServerError("[deleteRideRecord]", error);
    throw new Error("ride");
  }
}
