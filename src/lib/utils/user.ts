import { createSSRClient } from "../supabase/server";

export async function isAdminValidation(userId: string): Promise<boolean> {
  const supabase = await createSSRClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .single();
  return profile?.is_admin;
}
