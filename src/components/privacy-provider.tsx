"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LegalCopy } from "@/i18n/types";
import { hrefs } from "@/lib/paths";
import { disableBrowserAnalytics, enableBrowserAnalytics } from "@/lib/analytics";
import {
  applyPrivacyChoice,
  type PrivacyPrefs,
} from "@/lib/privacy";

type PrivacyContextValue = {
  openSettings: () => void;
};

const PrivacyContext = createContext<PrivacyContextValue | null>(null);

function isSecurePage() {
  return typeof window !== "undefined" && window.location.protocol === "https:";
}

function writeAssignments(assignments: string[]) {
  for (const assignment of assignments) {
    document.cookie = assignment;
  }
}

export function usePrivacySettings() {
  const ctx = useContext(PrivacyContext);
  if (!ctx) {
    throw new Error("PrivacyProvider is required");
  }
  return ctx;
}

export function CookieSettingsButton({ label }: { label: string }) {
  const { openSettings } = usePrivacySettings();
  return (
    <button
      type="button"
      onClick={openSettings}
      className="inline-flex min-h-11 items-center hover:text-bone"
    >
      {label}
    </button>
  );
}

const actionClass =
  "min-h-11 w-full border border-line bg-rubber px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-bone hover:bg-panel";

export function PrivacyProvider({
  children,
  locale,
  copy,
  initialPrefs,
  analyticsConfigured,
}: {
  children: ReactNode;
  locale: string;
  copy: LegalCopy;
  initialPrefs: PrivacyPrefs | null;
  analyticsConfigured: boolean;
}) {
  const router = useRouter();
  const titleId = useId();
  const bodyId = useId();
  const dialogTitleId = useId();
  const dialogBodyId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const [prefs, setPrefs] = useState<PrivacyPrefs | null>(initialPrefs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState(initialPrefs?.analytics ?? false);
  const links = hrefs(locale);
  const needsChoice = prefs === null;
  const showBanner = needsChoice && !dialogOpen;

  const persist = useCallback(
    (analytics: boolean) => {
      const { prefs: next, assignments } = applyPrivacyChoice(analytics, isSecurePage());
      writeAssignments(assignments);
      if (analytics) enableBrowserAnalytics();
      else disableBrowserAnalytics();
      setPrefs(next);
      setAnalyticsChoice(analytics);
      setDialogOpen(false);
      router.refresh();
    },
    [router],
  );

  const openSettings = useCallback(() => {
    setAnalyticsChoice(prefs?.analytics ?? false);
    setDialogOpen(true);
  }, [prefs]);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setAnalyticsChoice(prefs?.analytics ?? false);
  }, [prefs]);

  useEffect(() => {
    if (!showBanner) return;
    const previous = document.body.style.paddingBottom;
    document.body.style.paddingBottom = "13rem";
    return () => {
      document.body.style.paddingBottom = previous;
    };
  }, [showBanner]);

  useEffect(() => {
    if (!dialogOpen) return;
    const node = dialogRef.current;
    node?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDialog();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [dialogOpen, closeDialog]);

  return (
    <PrivacyContext.Provider value={{ openSettings }}>
      {children}
      {showBanner ? (
        <aside
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-rubber p-4 sm:p-5"
          role="region"
          aria-labelledby={titleId}
          aria-describedby={bodyId}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 id={titleId} className="text-sm font-semibold uppercase tracking-[0.16em] text-bone">
                {copy.consent.title}
              </h2>
              <p id={bodyId} className="mt-2 text-sm leading-6 text-mist">
                {copy.consent.body}
              </p>
              <p className="mt-2 text-xs leading-6 text-mist">
                <Link href={links.cookies} className="underline underline-offset-4 hover:text-bone">
                  {copy.nav.cookies}
                </Link>
              </p>
            </div>
            <div className="grid w-full gap-2 sm:grid-cols-3 lg:w-auto lg:min-w-[34rem]">
              <button type="button" className={actionClass} onClick={() => persist(true)}>
                {copy.consent.acceptAll}
              </button>
              <button type="button" className={actionClass} onClick={() => persist(false)}>
                {copy.consent.rejectOptional}
              </button>
              <button
                ref={settingsButtonRef}
                type="button"
                className={actionClass}
                onClick={openSettings}
              >
                {copy.consent.configure}
              </button>
            </div>
          </div>
        </aside>
      ) : null}
      {dialogOpen ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-bone/45"
            aria-label={copy.consent.close}
            onClick={closeDialog}
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            aria-describedby={dialogBodyId}
            tabIndex={-1}
            className="relative w-full max-w-lg border border-line bg-rubber p-5 shadow-lg outline-none"
          >
            <h2 id={dialogTitleId} className="text-sm font-semibold uppercase tracking-[0.16em] text-bone">
              {copy.consent.title}
            </h2>
            <p id={dialogBodyId} className="mt-3 text-sm leading-6 text-mist">
              {copy.consent.body}
            </p>
            <div className="mt-5 space-y-3">
              <div className="border border-line p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-bone">
                  {copy.consent.necessaryTitle}
                </p>
                <p className="mt-2 text-sm leading-6 text-mist">{copy.consent.necessaryBody}</p>
              </div>
              <div className="border border-line p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 accent-volt"
                    checked={analyticsChoice}
                    onChange={(event) => setAnalyticsChoice(event.target.checked)}
                  />
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-bone">
                      {copy.consent.analyticsTitle}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-mist">
                      {copy.consent.analyticsBody}
                    </span>
                    {analyticsConfigured ? null : (
                      <span className="mt-2 block text-sm leading-6 text-mist">
                        {copy.consent.analyticsInactive}
                      </span>
                    )}
                  </span>
                </label>
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button type="button" className={actionClass} onClick={() => persist(analyticsChoice)}>
                {copy.consent.save}
              </button>
              <button type="button" className={actionClass} onClick={closeDialog}>
                {copy.consent.close}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PrivacyContext.Provider>
  );
}
