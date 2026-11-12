import Link from "next/link";
import { fill } from "@/i18n/get-dictionary";
import type { Dictionary } from "@/i18n/types";
import type { IntranetNotice } from "@/lib/intranet-notices-helpers";
import { hrefs } from "@/lib/paths";

function noticeLabel(notice: IntranetNotice, t: Dictionary) {
  if (notice.kind === "join") {
    return fill(t.intranet.notices.join, {
      name: notice.name || t.intranet.cyclist,
      title: notice.title,
    });
  }
  if (notice.kind === "chat") {
    return fill(t.intranet.notices.chat, { title: notice.title });
  }
  return fill(t.intranet.notices.inbox, { title: notice.title });
}

export function IntranetNoticeList({
  notices,
  locale,
  t,
}: {
  notices: IntranetNotice[];
  locale: string;
  t: Dictionary;
}) {
  if (notices.length === 0) return null;
  const links = hrefs(locale);
  return (
    <section
      className="mt-8 border border-[#c1121f] bg-[#c1121f] p-4 text-black"
      aria-live="polite"
    >
      <p className="text-[11px] font-black uppercase tracking-[0.2em]">{t.intranet.notices.title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6">
        {notices.map((notice) => (
          <li key={notice.id}>
            <Link
              href={notice.kind === "inbox" ? links.inboxThread(notice.targetId) : links.ride(notice.targetId)}
              className="font-semibold hover:underline"
            >
              {noticeLabel(notice, t)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
