<div align="center">

# JobSwipe Dashboard

**Live dashboard for browsing 1000+ scraped job listings across Pakistan**

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-2.45-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?logo=framer&logoColor=white)](https://www.framer.com/motion)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

Browse and filter jobs scraped from LinkedIn, Indeed, Rozee.pk and Mustakbil across 20+ roles in Pakistan. Connects directly to Supabase, no backend API needed.

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Backend](#backend)

---

## Overview

JobSwipe is the frontend companion to the [Job Board Scraper](https://github.com/muhammadhaider02/Scrapling-Job-Boards-Scrapper) backend. The scraper runs on a daily schedule via GitHub Actions, populating a Supabase database with enriched job listings from 4 Pakistani job boards. This dashboard reads directly from that database using the Supabase client SDK.

Stats and job counts are fetched with exact count queries against the full dataset. The job table is paginated (50 per page) and all filters (search, source, job type, location) are pushed to the database so results stay accurate regardless of dataset size.

---

## Features

| Feature | Description |
|:---|:---|
| **Live stats bar** | Total jobs, per-platform breakdown, unique companies and locations, all queried from the full database |
| **Multi-filter search** | Filter by source (LinkedIn/Indeed/Rozee/Mustakbil), job type, location, or free-text search on title and company |
| **Paginated table** | 50 jobs per page with prev/next navigation and total count |
| **Job detail modal** | Click any row to see full description, skills, experience, education and a link to the original posting |
| **Dedicated job pages** | Direct URL access to any job via `/jobs/[id]` |
| **Reactive counts** | Stats bar updates in real-time as filters are applied |
| **Loading states** | Skeletal loaders matching layout dimensions during data fetches |
| **Empty states** | Clean messaging when no jobs match the current filters |
| **Responsive** | Mobile-first layout, single column on small screens, full table on desktop |
| **Spring animations** | Framer Motion spring physics on cards, table rows, and modal transitions |

---

## Tech Stack

| Layer | Technology |
|:---|:---|
| Framework | Next.js 14 (App Router) |
| UI | React 18 |
| Styling | Tailwind CSS 3.4 |
| Database | Supabase (PostgreSQL via `@supabase/supabase-js`) |
| Animation | Framer Motion 11 |
| Typography | Geist font family |
| Deployment | Vercel |

---

## Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)
- A Supabase project with a populated `jobs` table (see the [backend repo](https://github.com/muhammadhaider02/Scrapling-Job-Boards-Scrapper))

---

## Getting Started

```bash
git clone <repo-url>
cd jobswipe-dashboard

# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials (see [Environment Variables](#environment-variables)), then run:

```bash
npm run dev
```

---

## Project Structure

```
src/
  app/
    layout.tsx               <- root layout with metadata and global styles
    page.tsx                 <- home page, renders the Dashboard
    globals.css              <- Tailwind imports and base styles
    jobs/
      [id]/
        page.tsx             <- individual job detail page
  components/
    Dashboard.tsx            <- main orchestrator: fetches jobs, manages filters and pagination
    StatsBar.tsx             <- stats cards with per-source counts from exact DB queries
    Filters.tsx              <- search, source, job type, and location filter controls
    JobTable.tsx             <- paginated job table with row click to open detail
    JobDetail.tsx            <- modal overlay showing full job details
    JobDetailPage.tsx        <- standalone job detail for /jobs/[id] route
    EmptyState.tsx           <- shown when no jobs match filters
    LoadingSkeleton.tsx      <- skeletal placeholder during loading
  lib/
    supabase.ts              <- Supabase client init and Job type definition
.env.local.example           <- environment variable template
tailwind.config.ts           <- Tailwind theme with custom colors and fonts
next.config.js               <- Next.js configuration
package.json                 <- dependencies and scripts
```

---

## Backend

This frontend is powered by the [Job Board Scraper](https://github.com/muhammadhaider02/Scrapling-Job-Boards-Scrapper), a Scrapling pipeline that scrapes LinkedIn, Indeed, Rozee.pk and Mustakbil for 20+ roles across Pakistan. It runs daily via GitHub Actions, enriches each posting with skill extraction and experience parsing, deduplicates via Redis, and upserts everything to Supabase.
