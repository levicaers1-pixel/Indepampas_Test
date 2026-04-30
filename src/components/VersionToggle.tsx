import { createContext, useContext, useEffect, useState, type ReactNode, type ComponentType } from "react";

type Version = "old" | "new";
const STORAGE_KEY = "pampas-version";

const VersionContext = createContext<{
  version: Version;
  setVersion: (v: Version) => void;
}>({ version: "old", setVersion: () => {} });

export function VersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersionState] = useState<Version>("old");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) as
      | Version
      | null;
    if (stored === "old" || stored === "new") setVersionState(stored);
  }, []);

  const setVersion = (v: Version) => {
    setVersionState(v);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, v);
  };

  return <VersionContext.Provider value={{ version, setVersion }}>{children}</VersionContext.Provider>;
}

export function useVersion() {
  return useContext(VersionContext);
}

export function VersionToggle({ className = "" }: { className?: string }) {
  const { version, setVersion } = useVersion();
  return (
    <div className={`bg-black/85 backdrop-blur-md rounded-full p-0.5 sm:p-1 flex items-center shadow-lg shadow-black/20 border border-white/10 ${className}`}>
      <button
        onClick={() => setVersion("old")}
        className={`px-2.5 sm:px-4 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.18em] font-medium rounded-full transition-colors whitespace-nowrap ${
          version === "old" ? "bg-white text-black" : "text-white/70 hover:text-white"
        }`}
      >
        <span className="sm:hidden">Old</span>
        <span className="hidden sm:inline">Old version</span>
      </button>
      <button
        onClick={() => setVersion("new")}
        className={`px-2.5 sm:px-4 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.18em] font-medium rounded-full transition-colors whitespace-nowrap ${
          version === "new" ? "bg-[#8FBF4A] text-[#1C3D2A]" : "text-white/70 hover:text-white"
        }`}
      >
        <span className="sm:hidden">New</span>
        <span className="hidden sm:inline">New version</span>
      </button>
    </div>
  );
}

/** Helper for routes: render `New` when rebrand is on, otherwise `Old`. */
export function VersionSwitch({ Old, New }: { Old: ComponentType; New: ComponentType }) {
  const { version } = useVersion();
  return version === "new" ? <New /> : <Old />;
}
