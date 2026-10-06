import Link from "next/link";
import { notFound } from "next/navigation";
import { MemberEditForm } from "@/components/member-edit-form";
import { MemberNotes } from "@/components/member-notes";
import { MemberToolbar } from "@/components/member-toolbar";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { getMember, listMemberNotes } from "@/lib/members";
import { hrefs } from "@/lib/paths";
import { memberStamp } from "@/lib/stamp";

export default async function AdminMemberPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{
    estado?: string;
    clave?: string;
    correo?: string;
    datos?: string;
    nota?: string;
  }>;
}) {
  const { locale, id } = await params;
  const query = await searchParams;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const [member, notes] = await Promise.all([getMember(id), listMemberNotes(id)]);
  if (!member) notFound();

  const fullName = [member.name, member.lastName].filter(Boolean).join(" ");
  const inactive = member.memberStatus === "inactive";
  const statusLabel = inactive ? t.admin.memberStatusInactive : t.admin.memberStatusActive;
  const resetOk = query.clave === "ok";
  const statusOk = query.estado === "ok";
  const savedOk = query.datos === "ok";
  const noteOk = query.nota === "ok";
  const mailNote =
    query.correo === "ok"
      ? fill(t.admin.memberResetMailSent, { email: member.email })
      : query.correo === "fail"
        ? fill(t.admin.memberResetMailFailed, { email: member.email })
        : "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.admin.kicker}</p>
      <p className={`mt-3 text-[10px] uppercase tracking-[0.2em] ${inactive ? "text-sodium" : "text-volt"}`}>
        {statusLabel}
        {member.createdAt ? ` · ${t.admin.memberSince} ${memberStamp(member.createdAt)}` : ""}
      </p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">{fullName || member.slug}</h1>
      <p className="mt-4 max-w-xl text-mist">{t.admin.detailTitle}</p>
      {statusOk ? (
        <p role="status" className="mt-6 max-w-xl border border-volt bg-rubber p-4 text-sm leading-7 text-bone">
          {statusLabel}
        </p>
      ) : null}
      {resetOk ? (
        <p role="status" className="mt-6 max-w-xl border border-volt bg-rubber p-4 text-sm leading-7 text-bone">
          {t.admin.memberResetOk}
          {mailNote ? ` ${mailNote}` : ""}
        </p>
      ) : null}
      {savedOk ? (
        <p role="status" className="mt-6 max-w-xl border border-volt bg-rubber p-4 text-sm leading-7 text-bone">
          {t.admin.memberSaveOk}
        </p>
      ) : null}
      {noteOk ? (
        <p role="status" className="mt-6 max-w-xl border border-volt bg-rubber p-4 text-sm leading-7 text-bone">
          {t.admin.memberNoteOk}
        </p>
      ) : null}

      <MemberEditForm member={member} locale={locale} t={t} />
      <MemberNotes memberId={member.id} locale={locale} notes={notes} t={t} />
      <MemberToolbar id={member.id} locale={locale} status={member.memberStatus} t={t} />

      <Link
        href={links.adminMembers}
        className="mt-10 inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.2em] text-sodium"
      >
        {t.admin.membersBack}
      </Link>
    </div>
  );
}
