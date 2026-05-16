"use client";

import { Job } from "@/lib/supabase";
import { motion } from "framer-motion";

type Props = {
  job: Job;
  onClose: () => void;
};

export function JobDetail({ job, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-surface rounded-3xl border border-border shadow-2xl
                   max-w-2xl w-full max-h-[80vh] overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 z-10 w-8 h-8 flex items-center justify-center
                     rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors text-zinc-500"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>

        <div className="overflow-y-auto max-h-[80vh] p-6 md:p-8 space-y-5">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-900">
              {job.job_title}
            </h2>
            <p className="text-zinc-500 mt-1">
              {job.company} {job.location && `• ${job.location}`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {job.job_source && (
              <Tag label={job.job_source} variant="source" />
            )}
            {job.job_type && <Tag label={job.job_type} variant="type" />}
            {job.experience_required !== null && (
              <Tag label={`${job.experience_required}+ yrs exp`} variant="exp" />
            )}
            {job.education_required && (
              <Tag label={job.education_required} variant="edu" />
            )}
          </div>

          {job.skills_required && job.skills_required.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2">
                Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {job.skills_required.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-sky-50 text-sky-700 text-xs rounded-md font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.job_description && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2">
                Description
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed max-w-[65ch] whitespace-pre-line line-clamp-[20]">
                {job.job_description}
              </p>
            </div>
          )}

          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium
                         rounded-xl hover:bg-zinc-800 active:scale-[0.98] transition-all"
            >
              View Original Posting
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Tag({ label, variant }: { label: string; variant: string }) {
  const styles: Record<string, string> = {
    source: "bg-blue-50 text-blue-700",
    type: "bg-amber-50 text-amber-700",
    exp: "bg-emerald-50 text-emerald-700",
    edu: "bg-violet-50 text-violet-700",
  };
  return (
    <span
      className={`px-2.5 py-1 text-xs rounded-lg font-medium capitalize ${styles[variant] || "bg-zinc-100 text-zinc-600"}`}
    >
      {label}
    </span>
  );
}
