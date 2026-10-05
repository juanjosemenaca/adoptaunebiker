import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { landingSection } from "@/lib/paths";
import { privateMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return privateMetadata("Adopta un eBiker");
}

export default async function ComunidadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(landingSection(locale, "comunidad"));
}
