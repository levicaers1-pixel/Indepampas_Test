# Rebuild Course Ratings

Reworks `/ratings` into a richer, opinionated parcours guide with host personas, a match quiz, expandable cards, and a new Supabase schema.

## 1. Database (new migration)

New tables (alongside existing `course_ratings`, which we keep for now to avoid breaking the rating-article route — we'll migrate or drop later):

- `courses` — master course list (name, country, region, type, greenfee, fee_category, holes, website, episode_url, lat/lng optional)
- `ratings` — one row per host per course, 7 criteria 1–10, generated `host_score` column, verdict fields (hole_of_day, would_return, one_word, review, played_on)
- `course_summary` view — pampas_score (avg of host_scores), rated_by_count, rated_by_hosts, per-host scores
- GRANTs: public SELECT (courses, ratings, view); authenticated admin write via existing `has_role('admin')` policies
- RLS: enable on both, public read, admin write

Fee category derived in seed/insert via simple CASE based on greenfee.

## 2. Seed data

Insert the 10 courses + ~30 host ratings from the prompt via `supabase--insert` after migration approval.

## 3. Frontend

New files:
- `src/data/personas.ts` — HOST_PERSONAS object (colors, affinities, taglines, loves)
- `src/data/courses-db.ts` — `fetchCourseSummaries()` returning typed rows from the view + nested ratings
- `src/components/ratings/MatchQuiz.tsx` — 3-step modal/inline quiz, computes match, sets active host filter
- `src/components/ratings/CourseCard.tsx` — collapsed/expanded accordion card, score badge, host chips, criteria bars, verdict table, disagreement 🔥 badge, episode play button
- `src/components/ratings/FiltersBar.tsx` — sticky search/region/type/fee/hosts/sort
- `src/components/ratings/HostChip.tsx` — pill with persona color/icon
- `src/components/ratings/PampasScore.tsx` — circular color-coded score badge
- `src/components/ratings/RatingsPage.tsx` — page composition with state for filters + active persona
- `src/lib/personalScore.ts` — `personalScore(ratings, affinities)` helper

Updated:
- `src/routes/ratings.index.tsx` — load from new `course_summary` view, render `RatingsPage`
- Keep `src/routes/ratings.$slug.tsx` working: either point to old `course_ratings` table (unchanged) or hide course-detail link for new courses. **Simplest:** keep `$slug` route as-is reading from `course_ratings` (legacy) and make new cards NOT link to detail pages — all content lives in the accordion. We'll add a slug column to `courses` later if a detail page is needed.

## 4. Design

Dark aesthetic per prompt:
- Background `#141412`, cards `#1E1E1C`, text `#F5F3EE`
- Score colors: green ≥80, blue 70–79, amber 55–69, red <55
- Per-host accent colors from personas
- Font: keep existing `font-rb-serif` for display, `font-rb-sans` for body (already in project)

## 5. Out of scope (call out)

Wishlist tab, share card image generation, host score history deltas, course type SVG icons — noted as ideas but not built this round to keep the PR focused.

## Order of operations

1. Submit migration (waits for user approval)
2. Insert seed data
3. Write personas + helpers
4. Build components
5. Wire `ratings.index.tsx` to new data source
6. Visual QA in preview