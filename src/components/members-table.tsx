"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Dictionary } from "@/i18n/types";
import type { MemberStatus } from "@/lib/types";

export type MemberTableRow = {
  id: string;
  href: string;
  name: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
  veteran: string;
  beginner: string;
  interested: string;
  status: MemberStatus;
  statusLabel: string;
  createdAt: string;
  createdLabel: string;
};

type SortKey = keyof Pick<
  MemberTableRow,
  | "name"
  | "lastName"
  | "email"
  | "country"
  | "city"
  | "veteran"
  | "beginner"
  | "interested"
  | "status"
  | "createdAt"
>;

const COLUMNS: { key: SortKey; label: (t: Dictionary) => string }[] = [
  { key: "name", label: (t) => t.forms.name },
  { key: "lastName", label: (t) => t.forms.lastName },
  { key: "email", label: (t) => t.forms.email },
  { key: "country", label: (t) => t.forms.country },
  { key: "city", label: (t) => t.forms.city },
  { key: "veteran", label: (t) => t.forms.veteranIn },
  { key: "beginner", label: (t) => t.forms.beginnerIn },
  { key: "interested", label: (t) => t.forms.interestedIn },
  { key: "status", label: (t) => t.admin.memberStatus },
  { key: "createdAt", label: (t) => t.admin.memberSince },
];

function compareRows(
  a: MemberTableRow,
  b: MemberTableRow,
  key: SortKey,
  dir: 1 | -1,
  locale: string,
) {
  const left = a[key] ?? "";
  const right = b[key] ?? "";
  return left.localeCompare(right, locale, { sensitivity: "base", numeric: true }) * dir;
}

export function MembersTable({
  members,
  locale,
  t,
}: {
  members: MemberTableRow[];
  locale: string;
  t: Dictionary;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | MemberStatus>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);
  const [sortedByUser, setSortedByUser] = useState(false);

  const filters = [
    { value: "all" as const, label: t.admin.memberStatusAll },
    { value: "active" as const, label: t.admin.memberStatusActive },
    { value: "inactive" as const, label: t.admin.memberStatusInactive },
  ];

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = members
      .filter((row) => (status === "all" ? true : row.status === status))
      .filter((row) => {
        if (!needle) return true;
        const hay = [
          row.name,
          row.lastName,
          row.email,
          row.city,
          row.country,
          row.veteran,
          row.beginner,
          row.interested,
          row.statusLabel,
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(needle);
      });
    if (!sortedByUser) return filtered;
    return [...filtered].sort((a, b) => compareRows(a, b, sortKey, sortDir, locale));
  }, [members, query, sortKey, sortDir, sortedByUser, status, locale]);

  function toggleSort(key: SortKey) {
    setSortedByUser(true);
    if (sortKey === key) {
      setSortDir((value) => (value === 1 ? -1 : 1));
      return;
    }
    setSortKey(key);
    setSortDir(key === "createdAt" ? -1 : 1);
  }

  return (
    <div className="mt-10 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <label className="block max-w-sm flex-1 text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.admin.membersSearch}
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-2 min-h-11 w-full border border-line bg-rubber px-3 text-sm normal-case tracking-normal text-bone"
          />
        </label>
        <ul className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <li key={item.value}>
              <button
                type="button"
                onClick={() => setStatus(item.value)}
                className={`inline-flex min-h-11 items-center px-3 text-xs font-semibold uppercase tracking-[0.16em] ${
                  status === item.value
                    ? "bg-sodium text-bone"
                    : "border border-line text-bone hover:border-sodium"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {visible.length === 0 ? (
        <p className="text-mist">{t.admin.membersSearchEmpty}</p>
      ) : (
        <div className="overflow-x-auto border border-line bg-rubber">
          <table className="min-w-[1180px] w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-panel">
                {COLUMNS.map((column) => {
                  const active = sortKey === column.key;
                  return (
                    <th key={column.key} className="px-3 py-3 font-normal">
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        className={`text-[10px] uppercase tracking-[0.16em] ${
                          active ? "text-sodium" : "text-mist"
                        }`}
                      >
                        {column.label(t)}
                        {active ? (sortDir === 1 ? " ↑" : " ↓") : ""}
                      </button>
                    </th>
                  );
                })}
                <th className="px-3 py-3 text-[10px] font-normal uppercase tracking-[0.16em] text-mist">
                  {t.admin.open}
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-b-0">
                  <td className="px-3 py-3 text-bone">{row.name || "—"}</td>
                  <td className="px-3 py-3 text-bone">{row.lastName || "—"}</td>
                  <td className="px-3 py-3 text-mist">{row.email || "—"}</td>
                  <td className="px-3 py-3 text-mist">{row.country || "—"}</td>
                  <td className="px-3 py-3 text-mist">{row.city || "—"}</td>
                  <td className="px-3 py-3 text-mist">{row.veteran || "—"}</td>
                  <td className="px-3 py-3 text-mist">{row.beginner || "—"}</td>
                  <td className="px-3 py-3 text-mist">{row.interested || "—"}</td>
                  <td
                    className={`px-3 py-3 text-[10px] uppercase tracking-[0.16em] ${
                      row.status === "inactive" ? "text-sodium" : "text-volt"
                    }`}
                  >
                    {row.statusLabel}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-mist">{row.createdLabel || "—"}</td>
                  <td className="px-3 py-3">
                    <Link
                      href={row.href}
                      className="text-xs font-semibold uppercase tracking-[0.16em] text-sodium"
                    >
                      {t.admin.memberOpen}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
