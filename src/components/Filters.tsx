"use client";

import { FilterState } from "./Dashboard";

type Props = {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  sources: string[];
  jobTypes: string[];
};

export function Filters({ filters, setFilters, sources, jobTypes }: Props) {
  const hasActiveFilters =
    filters.source !== "all" || filters.jobType !== "all" || filters.search !== "";

  const resetFilters = () =>
    setFilters({ source: "all", search: "", jobType: "all" });

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Title or company..."
            className="px-3 py-2 text-sm bg-background border border-border rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                       transition-all placeholder:text-zinc-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500">Source</label>
          <select
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
            className="px-3 py-2 text-sm bg-background border border-border rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                       transition-all capitalize"
          >
            {sources.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Sources" : s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500">Job Type</label>
          <select
            value={filters.jobType}
            onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
            className="px-3 py-2 text-sm bg-background border border-border rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                       transition-all"
          >
            {jobTypes.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All Types" : t}
              </option>
            ))}
          </select>
        </div>

      </div>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}
