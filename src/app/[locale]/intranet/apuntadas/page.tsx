import { redirect } from "next/navigation";
import { hrefs } from "@/lib/paths";

export default async function JoinedRidesRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(hrefs(locale).rides);
}
