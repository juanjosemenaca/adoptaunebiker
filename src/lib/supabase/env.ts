export function hasSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(url && key && !url.includes("grasrjavkbeboynacvzp"));
}

export function supabaseUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL");
  if (value.includes("grasrjavkbeboynacvzp")) {
    throw new Error("Esta app no debe usar el proyecto ERP de Supabase.");
  }
  return value;
}

export function supabasePublishableKey() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!value) throw new Error("Falta NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  return value;
}
