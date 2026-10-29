import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Sponsor = Tables<"sponsors">;

export function SponsorsBanner() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    supabase
      .from("sponsors")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => setSponsors(data ?? []));
  }, []);

  if (sponsors.length === 0) return null;

  return (
    <section className="bg-[var(--rb-ground)] border-t border-[rgba(242,239,230,0.15)]">
      <div className="px-6 lg:px-14 py-12">
        <div className="text-center mb-8">
          <div className="font-rb-mono text-[0.7rem] tracking-[0.22em] uppercase text-[var(--rb-lime)]">
            Made possible by
          </div>
          <h2 className="font-rb-serif text-2xl md:text-3xl text-[var(--rb-ink)] mt-2">
            Onze sponsors
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-16">
          {sponsors.map((s) => {
            const img = (
              <span className="rb-cut inline-flex items-center bg-[var(--rb-ink)] px-5 py-3">
                <img
                  src={s.image_url}
                  alt={s.name}
                  loading="lazy"
                  decoding="async"
                  className="max-h-12 md:max-h-14 w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </span>
            );
            return s.link_url ? (
              <a
                key={s.id}
                href={s.link_url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                title={s.name}
                className="block"
              >
                {img}
              </a>
            ) : (
              <div key={s.id} title={s.name}>{img}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
