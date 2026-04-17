type Props = {
  /** Spotify URI like episode/xxxx or show/xxxx */
  uri: string;
  type?: "episode" | "show";
  height?: number;
  title?: string;
};

export function SpotifyEmbed({ uri, type = "episode", height = 232, title = "Spotify player" }: Props) {
  const src = `https://open.spotify.com/embed/${type}/${uri}?utm_source=generator&theme=0`;
  return (
    <div className="rounded-xl overflow-hidden border border-charcoal/10 bg-white shadow-sm">
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
    </div>
  );
}
