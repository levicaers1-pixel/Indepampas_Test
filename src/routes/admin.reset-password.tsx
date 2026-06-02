import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase places the recovery session in URL hash on this page load.
    // The client picks it up automatically; we just verify a session exists.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (password.length < 8) return setError("Minstens 8 tekens.");
    if (password !== confirm) return setError("Wachtwoorden komen niet overeen.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return setError(error.message);
    setInfo("Wachtwoord bijgewerkt. Je wordt doorgestuurd…");
    setTimeout(() => navigate({ to: "/admin", replace: true }), 1200);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F0E] px-6">
      <div className="w-full max-w-sm">
        <div className="h-[3px] w-full bg-[#BA7517] mb-8" />
        <form onSubmit={onSubmit} className="bg-[#1A1A18] border border-[#2A2A26] p-8 space-y-5">
          <h1 className="text-[#E8E4D8] text-lg font-medium tracking-wide">Nieuw wachtwoord</h1>
          {!ready ? (
            <p className="text-xs text-[#8A8270]">
              Open deze pagina via de resetlink in je inbox.
            </p>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.15em] uppercase text-[#8A8270]">Nieuw wachtwoord</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0F0F0E] border border-[#2A2A26] px-3 py-2 text-sm text-[#E8E4D8] focus:outline-none focus:border-[#BA7517]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.15em] uppercase text-[#8A8270]">Bevestig wachtwoord</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full bg-[#0F0F0E] border border-[#2A2A26] px-3 py-2 text-sm text-[#E8E4D8] focus:outline-none focus:border-[#BA7517]"
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              {info && <p className="text-xs text-[#BA7517]">{info}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#BA7517] hover:bg-[#A56714] text-[#0F0F0E] py-2.5 text-xs tracking-[0.15em] uppercase font-medium disabled:opacity-50"
              >
                {loading ? "Bezig…" : "Wachtwoord opslaan"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
