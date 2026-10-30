import { useDogInfo } from "@/lib/dogVotes";

export function PawIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="5.2" cy="11" rx="2" ry="2.7" transform="rotate(-18 5.2 11)" />
      <ellipse cx="9.6" cy="6.4" rx="2.1" ry="2.9" transform="rotate(-6 9.6 6.4)" />
      <ellipse cx="14.4" cy="6.4" rx="2.1" ry="2.9" transform="rotate(6 14.4 6.4)" />
      <ellipse cx="18.8" cy="11" rx="2" ry="2.7" transform="rotate(18 18.8 11)" />
      <path d="M12 11.4c-3.1 0-6 3.3-6 6.1 0 2 1.5 3.1 3.3 3.1 1 0 1.8-.5 2.7-.5s1.7.5 2.7.5c1.8 0 3.3-1.1 3.3-3.1 0-2.8-2.9-6.1-6-6.1z" />
    </svg>
  );
}

/** The certified pawprint next to a course: only shown once the dog status is settled as "ja, ook op de baan". */
export function DogBadge({ courseId }: { courseId: string }) {
  const { info } = useDogInfo(courseId);
  if (info.status !== "course") return null;

  const title = info.hostConfirmed
    ? "Honden welkom op de baan. Bevestigd door PAMPAS."
    : `Honden welkom op de baan volgens de community (${info.votesCourse} van ${info.votesTotal} bezoekers). Check altijd even bij de club.`;

  return (
    <span
      title={title}
      className="inline-flex items-center gap-1.5 border border-[rgba(182,240,74,0.45)] bg-[rgba(182,240,74,0.08)] px-2 py-1 font-rb-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--rb-lime)]"
    >
      <PawIcon size={12} />
      Hondvriendelijk
    </span>
  );
}
