import { supabase } from "@/integrations/supabase/client";

export async function hasAdminRole(userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  return !error && Boolean(data);
}

export async function getVerifiedAdminUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    await supabase.auth.signOut({ scope: "local" });
    return null;
  }

  const isAdmin = await hasAdminRole(data.user.id);
  if (!isAdmin) {
    await supabase.auth.signOut({ scope: "local" });
    return null;
  }

  return data.user;
}