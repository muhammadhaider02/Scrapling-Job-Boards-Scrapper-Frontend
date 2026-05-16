"use client";

import { useState } from "react";
import { Job } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { JobDetail } from "./JobDetail";

type Props = {
  jobs: Job[];
};

const sourceColors: Record<string, string> = {
  linkedin: "bg-blue-100 text-blue-700",
  indeed: "bg-violet-100 text-violet-700",
  mustakbil: "bg-emerald-100 text-emerald-700",
  rozee: "bg-rose-100 text-rose-700",
};

export function JobTable({ jobs }: Props) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <>
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider hidden md:table-cell">
                  Company
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider hidden lg:table-cell">
                  Location
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider">
                  Source
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider hidden lg:table-cell">
                  Type
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase tracking-wider hidden md:table-cell">
                  Scraped
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jobs.map((job, i) => (
                <motion.tr
                  key={job.job_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5) }}
                  onClick={() => setSelectedJob(job)}
                  className="hover:bg-zinc-50/80 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-zinc-900 line-clamp-1">
                      {job.job_title}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 hidden md:table-cell">
                    {job.company || "--"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 hidden lg:table-cell line-clamp-1">
                    {job.location || "--"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium capitalize
                        ${sourceColors[job.job_source?.toLowerCase()] || "bg-zinc-100 text-zinc-600"}`}
                    >
                      {job.job_source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 hidden lg:table-cell">
                    {job.job_type || "--"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 font-mono text-xs hidden md:table-cell">
                    {job.date_scrapped
                      ? new Date(job.date_scrapped).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })
                      : "--"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-4 py-3 text-xs text-zinc-500">
          Showing {jobs.length} jobs
        </div>
      </div>

      <AnimatePresence>
        {selectedJob && (
          <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
