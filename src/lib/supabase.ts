import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Job = {
  job_id: string;
  job_title: string;
  job_description: string;
  skills_required: string[];
  experience_required: number | null;
  education_required: string | null;
  job_type: string;
  location: string;
  industry: string | null;
  company: string;
  url: string;
  job_source: string;
  date_scrapped: string;
};
