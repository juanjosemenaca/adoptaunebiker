import { redirect } from "next/navigation";
import { hrefs } from "@/lib/paths";

export default async function ExplorarRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(hrefs(locale).intranet);
}
