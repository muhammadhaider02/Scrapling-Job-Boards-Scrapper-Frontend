"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, Job } from "@/lib/supabase";
import { StatsBar } from "./StatsBar";
import { Filters } from "./Filters";
import { JobTable } from "./JobTable";
import { EmptyState } from "./EmptyState";
import { LoadingSkeleton } from "./LoadingSkeleton";

const PAGE_SIZE = 50;

export type FilterState = {
  source: string;
  search: string;
  jobType: string;
};

export function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    source: "all",
    search: "",
    jobType: "all",
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("jobs")
        .select("*", { count: "exact" })
        .order("date_scrapped", { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (filters.source !== "all") {
        query = query.eq("job_source", filters.source);
      }
      if (filters.jobType !== "all") {
        query = query.ilike("job_type", `%${filters.jobType}%`);
      }
      if (filters.search) {
        query = query.or(
          `job_title.ilike.%${filters.search}%,company.ilike.%${filters.search}%`
        );
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;
      setJobs(data || []);
      setTotalCount(count || 0);
    } catch (e: any) {
      setError(e.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    setPage(0);
  }, [filters]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const sources = ["all", "linkedin", "indeed"];
  const jobTypes = ["all", "Full-time", "Part-time", "Contract", "Internship"];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900">
            JobSwipe
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">
            Live data from LinkedIn and Indeed across Pakistan
          </p>
        </div>
        <div className="flex gap-2 self-start md:self-auto">
          <a
            href="https://github.com/muhammadhaider02/Scrapling-Job-Boards-Scrapper"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-sm font-medium bg-zinc-900 text-white rounded-lg
                       hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <button
            onClick={fetchJobs}
            className="px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-lg
                       hover:bg-zinc-800 active:scale-[0.98] transition-all"
          >
            Refresh
          </button>
        </div>
      </header>

      <StatsBar filters={filters} />

      <Filters
        filters={filters}
        setFilters={setFilters}
        sources={sources}
        jobTypes={jobTypes}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : jobs.length === 0 ? (
        <EmptyState />
      ) : (
        <JobTable jobs={jobs} />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-surface border border-border rounded-2xl px-4 py-3">
          <span className="text-sm text-zinc-500">
            Page <span className="font-mono font-medium text-zinc-900">{page + 1}</span> of{" "}
            <span className="font-mono font-medium text-zinc-900">{totalPages}</span>
            {" "}({totalCount} jobs)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-border
                         hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-border
                         hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
