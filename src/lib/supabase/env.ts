function cleanEnv(value: string | undefined) {
  if (!value) return "";
  return value.trim().replace(/^["']|["']$/g, "").trim();
}

const ADOPTA_SUPABASE_URL = "https://yuhfjmlekblutmymtavm.supabase.co";
const ADOPTA_PUBLISHABLE_KEY = "sb_publishable_GgfKcRl42Z1jNzNiXTy_BQ_ogrms6GB";

export function configuredSupabaseUrl() {
  const value =
    cleanEnv(process.env.SUPABASE_URL) ||
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
    ADOPTA_SUPABASE_URL;
  return value.includes("grasrjavkbeboynacvzp") ? "" : value;
}

export function configuredSupabaseKey() {
  return (
    cleanEnv(process.env.SUPABASE_PUBLISHABLE_KEY) ||
    cleanEnv(process.env.SUPABASE_ANON_KEY) ||
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    ADOPTA_PUBLISHABLE_KEY
  );
}

export function hasSupabaseEnv() {
  const url = configuredSupabaseUrl();
  const key = configuredSupabaseKey();
  return Boolean(url && key);
}

export function supabaseUrl() {
  const value = configuredSupabaseUrl();
  if (!value) throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL");
  return value;
}

export function supabasePublishableKey() {
  const value = configuredSupabaseKey();
  if (!value) throw new Error("Falta NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  return value;
}
