import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env.ts";

function cleanEnv(value: string | undefined) {
  if (!value) return "";
  return value.trim().replace(/^["']|["']$/g, "").trim();
}

export function supabaseServiceRoleKey() {
  return cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function hasRetentionServiceRole() {
  return Boolean(supabaseServiceRoleKey());
}

export function createServiceClient() {
  const key = supabaseServiceRoleKey();
  if (!key) return null;
  return createClient(supabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
