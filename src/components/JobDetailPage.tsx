"use client";

import { useEffect, useState } from "react";
import { supabase, Job } from "@/lib/supabase";
import { LoadingSkeleton } from "./LoadingSkeleton";

type Props = {
  jobId: string;
};

export function JobDetailPage({ jobId }: Props) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("job_id", jobId)
        .single();
      setJob(data);
      setLoading(false);
    }
    fetchJob();
  }, [jobId]);

  if (loading) return <LoadingSkeleton />;
  if (!job)
    return (
      <div className="text-center py-20 text-zinc-500">Job not found.</div>
    );

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 md:p-10 space-y-6">
      <a
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
      >
        Back to dashboard
      </a>

      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {job.job_title}
        </h1>
        <p className="text-zinc-500 mt-1 text-lg">
          {job.company} {job.location && `- ${job.location}`}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-border py-4">
        <InfoBlock label="Source" value={job.job_source} />
        <InfoBlock label="Type" value={job.job_type || "--"} />
        <InfoBlock
          label="Experience"
          value={job.experience_required ? `${job.experience_required}+ yrs` : "--"}
        />
        <InfoBlock label="Education" value={job.education_required || "--"} />
      </div>

      {job.skills_required && job.skills_required.length > 0 && (
        <div>
          <h2 className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-3">
            Required Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.skills_required.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 bg-sky-50 text-sky-700 text-sm rounded-lg font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {job.job_description && (
        <div>
          <h2 className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-3">
            Description
          </h2>
          <div className="text-zinc-700 leading-relaxed whitespace-pre-line max-w-[65ch]">
            {job.job_description}
          </div>
        </div>
      )}

      {job.url && (
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-zinc-900 text-white font-medium
                     rounded-xl hover:bg-zinc-800 active:scale-[0.98] transition-all"
        >
          Apply on {job.job_source}
        </a>
      )}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-zinc-500 block">{label}</span>
      <span className="font-medium text-zinc-900 capitalize">{value}</span>
    </div>
  );
}
