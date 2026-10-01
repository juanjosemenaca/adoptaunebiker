import { logoutCommunity } from "@/app/actions";

export function LogoutButton({ locale, label }: { locale: string; label: string }) {
  return (
    <form action={logoutCommunity} className="inline-flex">
      <input type="hidden" name="locale" value={locale} />
      <button
        type="submit"
        className="inline-flex h-10 min-w-[5.75rem] items-center justify-center border border-line px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-bone hover:border-sodium"
      >
        {label}
      </button>
    </form>
  );
}
