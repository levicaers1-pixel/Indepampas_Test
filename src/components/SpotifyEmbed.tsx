import { useEffect, useRef, useState } from "react";

type Props = {
  /** Spotify URI like episode/xxxx or show/xxxx */
  uri: string;
  type?: "episode" | "show";
  height?: number;
  title?: string;
};

export function SpotifyEmbed({ uri, type = "episode", height = 232, title = "Spotify player" }: Props) {
  const src = `https://open.spotify.com/embed/${type}/${uri}?utm_source=generator&theme=0`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="rounded-xl overflow-hidden border border-charcoal/10 bg-white shadow-sm"
      style={{ minHeight: height }}
    >
      {shouldLoad ? (
        <iframe
          title={title}
          src={src}
          width="100%"
          height={height}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ display: "block" }}
        />
      ) : null}
    </div>
  );
}
