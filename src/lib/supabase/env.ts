function cleanEnv(value: string | undefined) {
  if (!value) return "";
  return value.trim().replace(/^["']|["']$/g, "").trim();
}

export function configuredSupabaseUrl() {
  return cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) || cleanEnv(process.env.SUPABASE_URL);
}

export function configuredSupabaseKey() {
  return (
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    cleanEnv(process.env.SUPABASE_PUBLISHABLE_KEY) ||
    cleanEnv(process.env.SUPABASE_ANON_KEY)
  );
}

export function hasSupabaseEnv() {
  const url = configuredSupabaseUrl();
  const key = configuredSupabaseKey();
  return Boolean(url && key && !url.includes("grasrjavkbeboynacvzp"));
}

export function supabaseUrl() {
  const value = configuredSupabaseUrl();
  if (!value) throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL");
  if (value.includes("grasrjavkbeboynacvzp")) {
    throw new Error("Esta app no debe usar el proyecto ERP de Supabase.");
  }
  return value;
}

export function supabasePublishableKey() {
  const value = configuredSupabaseKey();
  if (!value) throw new Error("Falta NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  return value;
}
