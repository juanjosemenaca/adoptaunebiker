import type { Metadata } from "next";
import { BikeGarageForm } from "@/components/bike-garage-form";
import { ChangePasswordForm } from "@/components/change-password-form";
import { MemberEditForm } from "@/components/member-edit-form";
import { ProfilePhotoForm } from "@/components/profile-photo-form";
import { getDictionary } from "@/i18n/get-dictionary";
import { getMemberById, memberFromSession } from "@/lib/members";
import { getSession } from "@/lib/session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(locale).intranet.account, robots: { index: false, follow: false } };
}

export default async function CuentaPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ datos?: string; clave?: string; foto?: string; bici?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const session = await getSession();
  if (!session) return null;
  const t = getDictionary(locale);
  const member = (await getMemberById(session.id)) ?? memberFromSession(session);
  const savedOk = query.datos === "ok";
  const passwordOk = query.clave === "ok";
  const bikesOk = query.bici === "ok";
  const photoNote =
    query.foto === "ok" ? t.intranet.photoOk : query.foto === "off" ? t.intranet.photoRemoved : "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.intranet.account}</p>
      <h1 className="display mt-3 text-6xl">{session.name}</h1>
      <p className="mt-4 max-w-xl text-mist">{t.intranet.accountLead}</p>

      {savedOk ? (
        <p role="status" className="mt-8 max-w-xl border border-volt bg-rubber p-4 text-sm leading-7 text-bone">
          {t.admin.memberSaveOk}
        </p>
      ) : null}
      {passwordOk ? (
        <p role="status" className="mt-8 max-w-xl border border-volt bg-rubber p-4 text-sm leading-7 text-bone">
          {t.intranet.passwordOk}
        </p>
      ) : null}
      {photoNote ? (
        <p role="status" className="mt-8 max-w-xl border border-volt bg-rubber p-4 text-sm leading-7 text-bone">
          {photoNote}
        </p>
      ) : null}
      {bikesOk ? (
        <p role="status" className="mt-8 max-w-xl border border-volt bg-rubber p-4 text-sm leading-7 text-bone">
          {t.intranet.bikesOk}
        </p>
      ) : null}

      <ProfilePhotoForm url={member.avatarUrl} name={session.name} locale={locale} t={t} />
      <BikeGarageForm memberId={member.id} locale={locale} t={t} garage={member.garage} next="cuenta" />
      <MemberEditForm member={member} locale={locale} t={t} next="cuenta" showHeading={false} />

      <section className="mt-12">
        <h2 className="display text-4xl">{t.intranet.changeTitle}</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-mist">{t.intranet.passwordLead}</p>
        <div className="mt-6 border border-line bg-rubber p-5 sm:p-6">
          <ChangePasswordForm locale={locale} t={t} next="cuenta" />
        </div>
      </section>
    </div>
  );
}
