import type { CourseWithRatings } from "@/data/courses-db";

export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " en ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Deterministic slug for a course. Uses slugified name; if two courses
 * share the same base slug we suffix with the first 6 chars of the id so
 * the URL stays stable.
 */
export function courseSlug(
  course: Pick<CourseWithRatings, "id" | "name">,
  allCourses: readonly Pick<CourseWithRatings, "id" | "name">[],
): string {
  const base = slugifyName(course.name);
  const collisions = allCourses.filter((c) => slugifyName(c.name) === base);
  if (collisions.length <= 1) return base;
  return `${base}-${course.id.slice(0, 6)}`;
}

/**
 * Find a course by slug, matching the same rule as courseSlug().
 */
export function findCourseBySlug<T extends Pick<CourseWithRatings, "id" | "name">>(
  slug: string,
  courses: readonly T[],
): T | undefined {
  return courses.find((c) => courseSlug(c, courses) === slug);
}

/** Build id → slug map once (O(n²) upfront, O(1) lookups afterwards). */
export function buildSlugMap<T extends Pick<CourseWithRatings, "id" | "name">>(
  courses: readonly T[],
): Map<string, string> {
  const baseCounts = new Map<string, number>();
  for (const c of courses) {
    const b = slugifyName(c.name);
    baseCounts.set(b, (baseCounts.get(b) ?? 0) + 1);
  }
  const out = new Map<string, string>();
  for (const c of courses) {
    const b = slugifyName(c.name);
    out.set(c.id, (baseCounts.get(b) ?? 1) > 1 ? `${b}-${c.id.slice(0, 6)}` : b);
  }
  return out;
}
