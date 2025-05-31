import { createSSRClient } from "../supabase/server";

export async function isAdminValidation(userId: string): Promise<boolean> {
  const supabase = await createSSRClient();

  try {
    // Primero intentar obtener is_admin de la tabla profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (profile && profile.is_admin !== null) {
      return profile.is_admin;
    }

    // Si no se encuentra en profiles, verificar en user metadata como fallback
    if (profileError) {
      const { data: userData } = await supabase.auth.getUser();

      if (userData.user && userData.user.id === userId) {
        const isAdminFromMeta =
          userData.user.user_metadata?.is_admin === "true" ||
          userData.user.user_metadata?.is_admin === true;
        return isAdminFromMeta;
      }
    }

    return false;
  } catch (error) {
    console.error("Error in isAdminValidation:", error);
    return false;
  }
}
