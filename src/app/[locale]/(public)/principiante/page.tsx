import { redirect } from "next/navigation";
import { landingSection } from "@/lib/paths";

export default async function PrincipiantePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(landingSection(locale, "principiante"));
}
