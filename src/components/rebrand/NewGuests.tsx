import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type GuestRow = {
  id: string;
  name: string;
  role: string | null;
  bio: string;
  image_url: string | null;
  website_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  sort_order: number;
  episodes: { title: string; number: string; spotify_id: string } | null;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function NewGuests() {
  const [guests, setGuests] = useState<GuestRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("guests")
      .select(
        "id,name,role,bio,image_url,website_url,instagram_url,linkedin_url,sort_order,episodes(title,number,spotify_id)",
      )
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setGuests((data as unknown as GuestRow[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="px-6 lg:px-14 pt-16 pb-12 border-b border-[rgba(28,61,42,0.15)]">
        <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#635C4B] mb-4">
          Gasten aan tafel
        </p>
        <h1 className="font-rb-serif font-light text-[clamp(2.8rem,5vw,4.5rem)] text-[#1C3D2A] leading-none">
          Vrienden van de <em className="italic">show</em>.
        </h1>
        <p className="font-rb-sans text-[0.95rem] text-[#635C4B] mt-3 max-w-xl">
          De mensen die mee aan tafel schoven, ons vooruit hielpen of gewoon een pint
          meedronken in het 19e hole.
        </p>
      </div>

      {loading ? (
        <div className="px-6 lg:px-14 py-20 font-rb-sans text-sm text-[#635C4B]">Laden…</div>
      ) : guests.length === 0 ? (
        <div className="px-6 lg:px-14 py-20 font-rb-sans text-sm text-[#635C4B]">
          Binnenkort stellen we hier onze gasten voor.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {guests.map((g, i) => (
            <article
              key={g.id}
              className="p-8 lg:p-10 border-b border-[rgba(28,61,42,0.15)] lg:[&:not(:nth-child(3n))]:border-r md:[&:not(:nth-child(2n))]:border-r lg:md:border-r-0 border-[rgba(28,61,42,0.15)] flex flex-col"
            >
              <p className="font-rb-mono text-[0.58rem] tracking-[0.18em] uppercase text-[#635C4B] mb-5">
                {String(i + 1).padStart(2, "0")} / Gast
              </p>

              <div className="aspect-[4/5] mb-6 overflow-hidden bg-[#E2D9C8] flex items-center justify-center">
                {g.image_url ? (
                  <img
                    src={g.image_url}
                    alt={`Portret van ${g.name}`}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale-[0.25]"
                  />
                ) : (
                  <span className="font-rb-serif text-4xl text-[#1C3D2A] opacity-40">
                    {initials(g.name)}
                  </span>
                )}
              </div>

              {g.role && (
                <p className="font-rb-mono text-[0.58rem] tracking-[0.16em] uppercase text-[#8FBF4A] mb-1">
                  {g.role}
                </p>
              )}
              <h2 className="font-rb-serif font-semibold text-[1.6rem] text-[#1C3D2A] leading-tight mb-3">
                {g.name}
              </h2>
              <p className="font-rb-sans text-[0.88rem] text-[#635C4B] leading-[1.75] whitespace-pre-line mb-6">
                {g.bio}
              </p>

              <div className="mt-auto space-y-3">
                {g.episodes && (
                  <a
                    href={`https://open.spotify.com/episode/${g.episodes.spotify_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block border-t border-[rgba(28,61,42,0.15)] pt-3 no-underline group"
                  >
                    <span className="font-rb-mono text-[0.55rem] tracking-[0.16em] uppercase text-[#635C4B]">
                      Te horen in {g.episodes.number}
                    </span>
                    <span className="block font-rb-sans text-[0.85rem] text-[#1C3D2A] group-hover:text-[#8FBF4A] transition-colors">
                      ▶ {g.episodes.title}
                    </span>
                  </a>
                )}

                {(g.website_url || g.instagram_url || g.linkedin_url) && (
                  <div className="flex flex-wrap gap-2">
                    {g.website_url && <GuestLink href={g.website_url} label="Website" />}
                    {g.instagram_url && <GuestLink href={g.instagram_url} label="Instagram" />}
                    {g.linkedin_url && <GuestLink href={g.linkedin_url} label="LinkedIn" />}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function GuestLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-rb-mono text-[0.55rem] tracking-[0.14em] uppercase no-underline border border-[rgba(28,61,42,0.25)] text-[#1C3D2A] px-3 py-1.5 hover:bg-[#1C3D2A] hover:text-[#F4EFE5] transition-colors"
    >
      {label}
    </a>
  );
}
