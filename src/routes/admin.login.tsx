import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

type Mode = "signin" | "forgot";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (!error && data.user) navigate({ to: "/admin", replace: true });
      if (error) supabase.auth.signOut({ scope: "local" });
    });
  }, [navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoading(false);
        setError(error.message || "Aanmelden mislukt");
        return;
      }
      const { data: userData, error: userError } = await supabase.auth.getUser();
      setLoading(false);
      if (userError || !userData.user) {
        setError("Aanmelden gelukt, maar de sessie kon niet worden bevestigd. Probeer opnieuw.");
        return;
      }
      navigate({ to: "/admin", replace: true });
      return;
    }

    // forgot password
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message || "Verzenden mislukt");
      return;
    }
    setInfo("Check je inbox voor een resetlink.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F0E] px-6">
      <div className="w-full max-w-sm">
        <div className="h-[3px] w-full bg-[#BA7517] mb-8" />
        <form
          onSubmit={onSubmit}
          className="bg-[#1A1A18] border border-[#2A2A26] p-8 space-y-5"
        >
          <h1 className="text-[#E8E4D8] text-lg font-medium tracking-wide">
            {mode === "signin" ? "Aanmelden" : "Wachtwoord vergeten"}
          </h1>
          <div className="space-y-2">
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#8A8270]">Email</label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0F0F0E] border border-[#2A2A26] px-3 py-2 text-sm text-[#E8E4D8] focus:outline-none focus:border-[#BA7517]"
            />
          </div>
          {mode === "signin" && (
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.15em] uppercase text-[#8A8270]">Wachtwoord</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0F0F0E] border border-[#2A2A26] px-3 py-2 text-sm text-[#E8E4D8] focus:outline-none focus:border-[#BA7517]"
              />
            </div>
          )}
          {error && <p className="text-xs text-red-400">{error}</p>}
          {info && <p className="text-xs text-[#BA7517]">{info}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#BA7517] hover:bg-[#A56714] text-[#0F0F0E] py-2.5 text-xs tracking-[0.15em] uppercase font-medium disabled:opacity-50"
          >
            {loading ? "Bezig…" : mode === "signin" ? "Aanmelden" : "Stuur resetlink"}
          </button>
          <button
            type="button"
            onClick={() => {
              setError("");
              setInfo("");
              setMode(mode === "signin" ? "forgot" : "signin");
            }}
            className="w-full text-[10px] tracking-[0.15em] uppercase text-[#8A8270] hover:text-[#BA7517]"
          >
            {mode === "signin" ? "Wachtwoord vergeten?" : "Terug naar aanmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}
