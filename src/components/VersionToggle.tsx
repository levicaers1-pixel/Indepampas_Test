import { useEffect, useState } from "react";

type Version = "old" | "new";
const STORAGE_KEY = "pampas-version";

export function useVersion(): [Version, (v: Version) => void] {
  const [version, setVersionState] = useState<Version>("old");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) as Version | null;
    if (stored === "old" || stored === "new") setVersionState(stored);
  }, []);

  const setVersion = (v: Version) => {
    setVersionState(v);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, v);
  };

  return [version, setVersion];
}

export function VersionToggle({
  version,
  onChange,
}: {
  version: Version;
  onChange: (v: Version) => void;
}) {
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] bg-charcoal/90 backdrop-blur-md rounded-full p-1 flex items-center shadow-xl shadow-black/20 border border-white/10">
      <button
        onClick={() => onChange("old")}
        className={`px-4 py-1.5 text-[10px] uppercase tracking-[0.18em] font-medium rounded-full transition-colors ${
          version === "old" ? "bg-mist text-charcoal" : "text-mist/70 hover:text-mist"
        }`}
      >
        Old version
      </button>
      <button
        onClick={() => onChange("new")}
        className={`px-4 py-1.5 text-[10px] uppercase tracking-[0.18em] font-medium rounded-full transition-colors ${
          version === "new" ? "bg-sage text-charcoal" : "text-mist/70 hover:text-mist"
        }`}
      >
        New version
      </button>
    </div>
  );
}
