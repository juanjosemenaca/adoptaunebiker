import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { answerRideRequestAction, cancelRideRequestAction } from "@/app/ride-actions";
import { MeetingPinView } from "@/components/meeting-pin-view";
import { RideHostActions } from "@/components/ride-host-actions";
import { RideChatForm } from "@/components/ride-chat-form";
import { RideJoinForm } from "@/components/ride-join-form";
import { dateLocale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { hrefs } from "@/lib/paths";
import {
  canManageHostedRide,
  canRequestRideSpot,
  canSeeRideChat,
  durationLabel,
  getRide,
  isRideFull,
  listRideJoinRequests,
  listRideMessages,
  rideStamp,
} from "@/lib/rides";
import { getSession } from "@/lib/session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const ride = await getRide(id);
  return {
    title: ride?.title ?? getDictionary(locale).intranet.groupRides.title,
    robots: { index: false, follow: false },
  };
}

export default async function RideDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await getSession();
  if (!session) return null;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const lang = dateLocale[locale as keyof typeof dateLocale] ?? locale;
  const ride = await getRide(id);
  if (!ride) notFound();

  const requests = await listRideJoinRequests(ride.id);
  const accepted = requests.filter((item) => item.status === "accepted");
  const pending = requests.filter((item) => item.status === "pending");
  const mine = requests.find((item) => item.riderId === session.id) ?? null;
  const isHost = ride.hostId === session.id;
  const canChat = canSeeRideChat(session.id, ride.hostId, mine?.status ?? null);
  const messages = canChat ? await listRideMessages(ride.id) : [];
  const full = isRideFull(ride.acceptedCount, ride.maxRiders);
  const canAsk = canRequestRideSpot({
    userId: session.id,
    hostId: ride.hostId,
    status: ride.status,
    joinStatus: mine?.status ?? null,
    acceptedCount: ride.acceptedCount,
    maxRiders: ride.maxRiders,
  });
  const statusLabel = {
    pending: t.intranet.pending,
    accepted: t.intranet.accepted,
    declined: t.intranet.declined,
    cancelled: t.intranet.groupRides.cancelled,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-sodium">
        {t.intranet.groupRides.title}
      </p>
      {canManageHostedRide(session.id, ride) ? (
        <div className="mt-6">
          <RideHostActions
            rideId={ride.id}
            locale={locale}
            editHref={links.rideEdit(ride.id)}
            t={t}
          />
        </div>
      ) : null}
      <h1 className="display mt-6 text-6xl">{ride.title}</h1>
      <p className="mt-4 text-mist">
        {rideStamp(ride.startsAt, lang)} · {durationLabel(ride.durationMin)}
        {ride.distanceKm
          ? ` · ${fill(t.intranet.groupRides.distanceKm, { n: ride.distanceKm })}`
          : ""}
        {ride.elevationM != null && ride.elevationM > 0
          ? ` · ${fill(t.intranet.groupRides.elevationM, { n: ride.elevationM })}`
          : ""}
      </p>
      <p className="mt-2 text-sm text-mist">
        {t.surfaces[ride.surface]} · {t.rideLevels[ride.level]}
        {ride.hostBike ? ` · ${ride.hostBike}` : ""}
      </p>
      <p className="mt-4 text-bone">{ride.place}</p>
      {ride.meetingLat != null && ride.meetingLng != null ? (
        <MeetingPinView
          pin={{ lat: ride.meetingLat, lng: ride.meetingLng }}
          label={ride.meetingPoint}
          openLabel={t.intranet.groupRides.meetingOpen}
          locale={locale}
        />
      ) : ride.meetingPoint ? (
        <MeetingPinView
          pin={null}
          label={ride.meetingPoint}
          openLabel={t.intranet.groupRides.meetingOpen}
          locale={locale}
        />
      ) : null}
      {ride.routeUrl ? (
        <p className="mt-2">
          <a
            href={ride.routeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-sodium hover:text-bone"
          >
            {t.intranet.groupRides.openRoute}
          </a>
        </p>
      ) : null}
      <p className="mt-4 text-sm text-mist">
        {fill(t.intranet.groupRides.hostedBy, { name: ride.hostName || t.intranet.cyclist })}
        {" · "}
        {ride.status === "cancelled"
          ? t.intranet.groupRides.cancelled
          : full
            ? t.intranet.groupRides.full
            : ride.maxRiders
              ? `${accepted.length + 1}/${ride.maxRiders}`
              : fill(t.intranet.groupRides.spots, { n: accepted.length + 1 })}
      </p>
      {ride.photoUrls.length > 0 ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {ride.photoUrls.map((src) => (
            <img key={src} src={src} alt="" className="h-48 w-full object-cover" />
          ))}
        </div>
      ) : null}
      {ride.notes ? (
        <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-bone/85">{ride.notes}</p>
      ) : null}

      <section className="mt-12">
        <h2 className="display text-4xl">{t.intranet.groupRides.whoGoes}</h2>
        <ul className="mt-4 divide-y divide-line border border-line bg-rubber">
          <li className="px-4 py-3 text-sm text-bone">
            {ride.hostName || t.intranet.cyclist}
          </li>
          {accepted.map((item) => (
            <li key={item.id} className="px-4 py-3 text-sm text-bone">
              {item.riderName || t.intranet.cyclist}
            </li>
          ))}
        </ul>
      </section>

      {isHost ? (
        <section className="mt-12">
          <h2 className="display text-4xl">{t.intranet.groupRides.pendingInbox}</h2>
          {pending.length === 0 ? (
            <p className="mt-3 text-sm text-mist">{t.intranet.groupRides.emptyPending}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pending.map((item) => (
                <li key={item.id} className="border border-line bg-rubber p-4">
                  <p className="text-sm text-bone">{item.riderName || t.intranet.cyclist}</p>
                  {item.message ? <p className="mt-2 text-sm text-mist">{item.message}</p> : null}
                  {ride.status === "open" ? (
                    <div className="mt-4 flex gap-2">
                      <form action={answerRideRequestAction}>
                        <input type="hidden" name="requestId" value={item.id} />
                        <input type="hidden" name="rideId" value={ride.id} />
                        <input type="hidden" name="status" value="accepted" />
                        <input type="hidden" name="locale" value={locale} />
                        <button
                          type="submit"
                          className="bg-volt px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-bone"
                        >
                          {t.intranet.accept}
                        </button>
                      </form>
                      <form action={answerRideRequestAction}>
                        <input type="hidden" name="requestId" value={item.id} />
                        <input type="hidden" name="rideId" value={ride.id} />
                        <input type="hidden" name="status" value="declined" />
                        <input type="hidden" name="locale" value={locale} />
                        <button
                          type="submit"
                          className="border border-line px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-mist"
                        >
                          {t.intranet.no}
                        </button>
                      </form>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {!isHost ? (
        <section className="mt-12 border border-line bg-rubber p-5">
          {mine ? (
            <>
              <p className="text-sm text-bone">
                {mine.status === "pending"
                  ? t.intranet.groupRides.requestSent
                  : statusLabel[mine.status]}
              </p>
              {mine.message ? <p className="mt-2 text-sm text-mist">{mine.message}</p> : null}
              {mine.status === "pending" ? (
                <form action={cancelRideRequestAction} className="mt-4">
                  <input type="hidden" name="requestId" value={mine.id} />
                  <input type="hidden" name="rideId" value={ride.id} />
                  <input type="hidden" name="locale" value={locale} />
                  <button
                    type="submit"
                    className="text-[11px] uppercase tracking-[0.16em] text-mist hover:text-bone"
                  >
                    {t.intranet.groupRides.cancelRequest}
                  </button>
                </form>
              ) : null}
            </>
          ) : canAsk ? (
            <RideJoinForm rideId={ride.id} locale={locale} t={t} />
          ) : ride.status !== "open" ? (
            <p className="text-sm text-mist">{t.intranet.groupRides.cancelled}</p>
          ) : full ? (
            <p className="text-sm text-mist">{t.intranet.groupRides.full}</p>
          ) : null}
        </section>
      ) : null}

      {canChat ? (
        <section className="mt-12">
          <h2 className="display text-4xl">{t.intranet.groupRides.chatTitle}</h2>
          <p className="mt-3 text-sm text-mist">{t.intranet.groupRides.chatHint}</p>
          <ul className="mt-4 space-y-3">
            {messages.map((message) => (
              <li key={message.id} className="border border-line bg-rubber p-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-mist">
                  {message.authorName || t.intranet.cyclist} · {rideStamp(message.createdAt, lang)}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-bone">{message.body}</p>
              </li>
            ))}
          </ul>
          {ride.status === "open" ? (
            <RideChatForm rideId={ride.id} locale={locale} t={t} />
          ) : null}
        </section>
      ) : null}

      {canManageHostedRide(session.id, ride) ? (
        <div className="mt-12">
          <RideHostActions
            rideId={ride.id}
            locale={locale}
            editHref={links.rideEdit(ride.id)}
            t={t}
          />
        </div>
      ) : null}
    </div>
  );
}
