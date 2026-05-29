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
        <button
          onClick={fetchJobs}
          className="px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-lg
                     hover:bg-zinc-800 active:scale-[0.98] transition-all self-start md:self-auto"
        >
          Refresh
        </button>
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
