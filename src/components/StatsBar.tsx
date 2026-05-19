"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { FilterState } from "./Dashboard";

type Props = {
  filters: FilterState;
};

function formatCount(n: number): string {
  if (n >= 1000) return "1000+";
  return String(n);
}

function applyFilters(query: any, filters: FilterState) {
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
  return query;
}

export function StatsBar({ filters }: Props) {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);

      const baseTotal = applyFilters(
        supabase.from("jobs").select("*", { count: "exact", head: true }),
        filters
      );
      const baseLinkedin = applyFilters(
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("job_source", "linkedin"),
        filters
      );
      const baseIndeed = applyFilters(
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("job_source", "indeed"),
        filters
      );
      const baseMustakbil = applyFilters(
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("job_source", "mustakbil"),
        filters
      );
      const baseRozee = applyFilters(
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("job_source", "rozee"),
        filters
      );
      const baseCompanies = applyFilters(
        supabase.from("jobs").select("company"),
        filters
      );
      const [totalRes, linkedinRes, indeedRes, mustakbilRes, rozeeRes, companiesRes] =
        await Promise.all([
          baseTotal,
          baseLinkedin,
          baseIndeed,
          baseMustakbil,
          baseRozee,
          baseCompanies,
        ]);

      const uniqueCompanies = new Set(
        (companiesRes.data || []).map((r: any) => r.company?.toLowerCase()).filter(Boolean)
      ).size;

      setStats({
        total: totalRes.count || 0,
        linkedin: linkedinRes.count || 0,
        indeed: indeedRes.count || 0,
        mustakbil: mustakbilRes.count || 0,
        rozee: rozeeRes.count || 0,
        companies: uniqueCompanies,
      });
      setLoading(false);
    }
    fetchStats();
  }, [filters]);

  const statItems = [
    { label: "Total Jobs", value: stats.total, color: "bg-sky-500" },
    { label: "LinkedIn", value: stats.linkedin, color: "bg-blue-600" },
    { label: "Indeed", value: stats.indeed, color: "bg-violet-600" },
    { label: "Mustakbil", value: stats.mustakbil, color: "bg-emerald-600" },
    { label: "Rozee", value: stats.rozee, color: "bg-rose-500" },
    { label: "Companies", value: stats.companies, color: "bg-amber-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {statItems.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, type: "spring", stiffness: 120, damping: 20 }}
          className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-1"
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${stat.color}`} />
            <span className="text-xs text-zinc-500 font-medium">{stat.label}</span>
          </div>
          <span className="text-2xl font-semibold font-mono tracking-tight text-zinc-900">
            {loading || stat.value === undefined ? "--" : formatCount(stat.value)}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
