# VIT NEXUS — Academic Command Center

> **Futuristic academic scheduling engine and timetable command center for Vishwakarma Institute of Technology (VIT Pune) students.**

Built by **Daksh Mehan** (CSE AI · Batch 1 · VIT Pune).

---

## Overview

**VIT Nexus** replaces cumbersome and static departmental PDF timetables with an ultra-responsive, offline-first Progressive Web App (PWA). Engineered around an **Obsidian HUD Cockpit** aesthetic, it delivers live class countdowns, batch-aware practical filtering, academic calendar intelligence, and deterministic schedule navigation.

### Key Capabilities

- **Zero-Fabrication Policy**: Guarantees that every lecture, tutorial, practical lab, faculty initial, and room designation matches official VIT Form FF957 records. No guesswork, no synthetic placeholders.
- **Batch-Aware Engine**: Real-time filtering for laboratory and tutorial groups (Batch 1, Batch 2, Batch 3) while seamlessly rendering whole-division theory sessions.
- **Cinematic Next/Current Class Hero**: Live countdown ticking to the exact second, door plate room identification, and real-time session progress bars.
- **Weekly Schedule Matrix**: Responsive multi-column timetable grid on desktop and compact day-switching matrix on mobile devices.
- **Explicit Free Period Tracking**: Gaps between sessions and lunch intervals are highlighted with exact duration calculations.
- **Academic Calendar Intelligence**: Built-in awareness of official VIT holidays, compensatory working day orders, and examination periods (Mid-Sem, In-Sem Labs, End-Sem).
- **Offline Verified Caching**: Full PWA capabilities via service workers and versioned local storage. If network connectivity drops, the app clearly displays verified cached data with its exact retrieval timestamp.

---

## Architecture & Data Flow

```
[ Official VIT Form FF957 PDF ]
               │
               ▼
[ Python / Node PDF Ingestion Pipeline ]
  ├─ Raw Extraction Schema (`pdfExtractionSchema.ts`)
  └─ Strict Rules Validator (`validateTimetableRecords.ts`)
               │
       (Verification Gate)
               │
               ▼
      [ Supabase Database ]
        ├─ `tt_divisions`  (Divisions catalog)
        └─ `tt_sessions`   (Individual timetable sessions)
               │
          (REST API)
               │
               ▼
   [ VIT Nexus Frontend (React/Vite/PWA) ]
     ├─ Timetable Service (`timetableService.ts`)
     ├─ Offline Storage Engine (`storage.ts`)
     └─ Live IST Clock & Countdown Engine (`useLiveClock.ts`)
```

---

## Supabase Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- 1. Divisions Catalog Table
CREATE TABLE IF NOT EXISTS tt_divisions (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  branch TEXT NOT NULL,
  division TEXT NOT NULL,
  pdf_label TEXT NOT NULL,
  academic_year TEXT NOT NULL DEFAULT '2026-27',
  version TEXT NOT NULL DEFAULT '1.0',
  effective_from DATE NOT NULL,
  effective_to DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Timetable Sessions Table
CREATE TABLE IF NOT EXISTS tt_sessions (
  id BIGSERIAL PRIMARY KEY,
  division TEXT NOT NULL REFERENCES tt_divisions(slug) ON DELETE CASCADE,
  weekday INT NOT NULL CHECK (weekday >= 1 AND weekday <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('Theory', 'Lab', 'Tutorial', 'Activity', 'Project')),
  batch TEXT CHECK (batch IN ('1', '2', '3') OR batch IS NULL),
  room TEXT NOT NULL,
  faculty_initials TEXT NOT NULL,
  faculty_name TEXT,
  faculty_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_time_order CHECK (start_time < end_time)
);

-- 3. Indexes for Instant Retrieval
CREATE INDEX IF NOT EXISTS idx_tt_sessions_div_weekday ON tt_sessions(division, weekday);
CREATE INDEX IF NOT EXISTS idx_tt_sessions_batch ON tt_sessions(batch);

-- 4. Row Level Security (RLS)
ALTER TABLE tt_divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tt_sessions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all verified schedule data
CREATE POLICY "Public divisions are readable by anyone"
  ON tt_divisions FOR SELECT
  USING (true);

CREATE POLICY "Public sessions are readable by anyone"
  ON tt_sessions FOR SELECT
  USING (true);
```

---

## Local Development & Setup

### 1. Prerequisites
- Node.js 18+
- npm or pnpm

### 2. Installation
```bash
git clone <repository-url>
cd vit-nexus
npm install
```

### 3. Environment Configuration
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Ensure your public Supabase configuration is present:
```env
VITE_SUPABASE_URL=https://fqfzygubyjqkimsphmdn.supabase.co
VITE_SUPABASE_ANON_KEY=<your-public-anon-key>
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## Ingestion Pipeline Usage

To validate and ingest newly published timetable PDFs:

1. Extract raw tabular records using your preferred PDF parser.
2. Structure them matching `RawExtractedSessionRecord` in `scripts/ingestion/pdfExtractionSchema.ts`.
3. Run the validation engine:
   ```ts
   import { runIngestionPipeline } from './scripts/ingestion/timetableIngestionPipeline';
   
   const { report, sqlStatements } = runIngestionPipeline('FY-CSAI-B_2026.pdf', rawData);
   console.log(`Accepted: ${report.recordsAccepted}, Rejected: ${report.recordsRejected}`);
   ```
4. Only records satisfying 100% of invariant checks are accepted for insertion into the database.

---

## Design Constitution

- **Obsidian Dark Palette**: Strict 60-30-10 color discipline: 60% deep slate/black canvas (`#030712`, `#0b1120`), 30% structured HUD panels (`#0f172a`), 10% electric cyan/indigo accents (`#06b6d4`, `#6366f1`).
- **Tabular Numerals**: Strict application of `tabular-nums` for all clock times, countdowns, room codes, and dates to ensure jitter-free animations.
- **Zero Pill Slop**: Minimalist badges with purposeful typography and high-contrast borders.

---

## Creator & Disclaimer

- **Creator**: **Daksh Mehan** (B.Tech Computer Science & Engineering - Artificial Intelligence, Batch 1).
- **Disclaimer**: VIT Nexus is an independent, student-engineered open-source academic tool. It is not officially operated or endorsed by Vishwakarma Institute of Technology, Pune. Timetable data is parsed from publicly distributed institutional Form FF957 sheets.
