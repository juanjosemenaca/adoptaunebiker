"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getDictionary } from "@/i18n/get-dictionary";
import { defaultLocale, isLocale } from "@/i18n/config";
import {
  createAdminInboxThread,
  createInboxThread,
  deleteAdminInboxThread,
  insertInboxMessage,
  parseAdminInboxDraft,
  parseInboxDraft,
  parseInboxReply,
  setInboxThreadStatus,
} from "@/lib/admin-inbox";
import { hrefs, loginHref } from "@/lib/paths";
import { getSession, isAdmin } from "@/lib/session";
import { isInboxStatus } from "@/lib/admin-inbox-helpers";

function localeFromForm(formData: FormData) {
  const value = String(formData.get("locale") ?? "");
  return isLocale(value) ? value : defaultLocale;
}

function inboxError(locale: string, key: string) {
  const t = getDictionary(locale);
  if (key === "subject") return t.errors.inboxSubject;
  if (key === "kind") return t.errors.inboxKind;
  if (key === "body") return t.errors.inboxBody;
  if (key === "member") return t.errors.inboxMember;
  if (key === "inboxClosed") return t.errors.inboxClosed;
  return t.errors.inbox;
}

function revalidateInbox(locale: string, threadId?: string, memberId?: string) {
  const lang = isLocale(locale) ? locale : defaultLocale;
  revalidatePath(`/${lang}/intranet/comunicacion`);
  revalidatePath(`/${lang}/admin/mensajes`);
  revalidatePath(`/${lang}/admin`);
  if (threadId) {
    revalidatePath(`/${lang}/intranet/comunicacion/${threadId}`);
    revalidatePath(`/${lang}/admin/mensajes/${threadId}`);
  }
  if (memberId) revalidatePath(`/${lang}/admin/mensajes/miembro/${memberId}`);
}

export async function createInboxThreadAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const session = await getSession();
  if (!session) redirect(loginHref(locale, hrefs(locale).inbox));
  if (isAdmin(session)) redirect(hrefs(locale).adminInbox);
  const draft = parseInboxDraft({
    subject: String(formData.get("subject") ?? ""),
    kind: String(formData.get("kind") ?? ""),
    body: String(formData.get("body") ?? ""),
  });
  if ("error" in draft) return { error: inboxError(locale, draft.error) };
  try {
    const id = await createInboxThread(draft.subject, draft.kind, draft.body);
    revalidateInbox(locale, id);
    redirect(hrefs(locale).inboxThread(id));
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const key = error instanceof Error ? error.message : "inbox";
    return { error: inboxError(locale, key) };
  }
}

export async function sendInboxMessageAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const session = await getSession();
  const admin = isAdmin(session);
  const threadId = String(formData.get("threadId") ?? "");
  const back = admin ? hrefs(locale).adminInboxThread(threadId) : hrefs(locale).inboxThread(threadId);
  if (!session) redirect(loginHref(locale, back));
  const parsed = parseInboxReply(String(formData.get("body") ?? ""));
  if ("error" in parsed) return { error: inboxError(locale, String(parsed.error)) };
  try {
    await insertInboxMessage(threadId, parsed.body);
  } catch (error) {
    const key = error instanceof Error ? error.message : "inbox";
    return { error: inboxError(locale, key) };
  }
  revalidateInbox(locale, threadId);
  redirect(back);
}

export async function createAdminInboxThreadAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    redirect(loginHref(locale, hrefs(locale).adminInbox));
  }
  const draft = parseAdminInboxDraft({
    memberId: String(formData.get("memberId") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    body: String(formData.get("body") ?? ""),
  });
  if ("error" in draft) return { error: inboxError(locale, draft.error) };
  try {
    const id = await createAdminInboxThread(draft.memberId, draft.subject, draft.body);
    revalidateInbox(locale, id, draft.memberId);
    redirect(hrefs(locale).adminInboxThread(id));
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const key = error instanceof Error ? error.message : "inbox";
    return { error: inboxError(locale, key) };
  }
}

export async function deleteAdminInboxThreadAction(formData: FormData): Promise<void> {
  const locale = localeFromForm(formData);
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    redirect(loginHref(locale, hrefs(locale).adminInbox));
  }
  const threadId = String(formData.get("threadId") ?? "");
  const memberId = String(formData.get("memberId") ?? "");
  try {
    await deleteAdminInboxThread(threadId);
  } catch {
    return;
  }
  revalidateInbox(locale, threadId, memberId);
  redirect(memberId ? hrefs(locale).adminInboxMember(memberId) : hrefs(locale).adminInbox);
}

export async function setInboxThreadStatusAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const session = await getSession();
  const threadId = String(formData.get("threadId") ?? "");
  if (!session || !isAdmin(session)) {
    redirect(loginHref(locale, hrefs(locale).adminInbox));
  }
  const status = String(formData.get("status") ?? "");
  if (!isInboxStatus(status)) return;
  try {
    await setInboxThreadStatus(threadId, status);
  } catch {
    return;
  }
  revalidateInbox(locale, threadId);
  redirect(hrefs(locale).adminInboxThread(threadId));
}
