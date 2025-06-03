import { createSSRClient } from "../supabase/server";

export async function isAdminValidation(userId: string): Promise<boolean> {
  const supabase = await createSSRClient();

  try {
    // Intentar obtener is_admin de la tabla profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error al verificar perfil de admin:", profileError);
      // En caso de error, verificar usando la función RPC
      try {
        const { data: isAdminResult, error: rpcError } = await supabase.rpc(
          "is_admin",
          { user_id: userId }
        );

        if (rpcError) {
          console.error("Error en RPC is_admin:", rpcError);
          return false;
        }

        return isAdminResult || false;
      } catch (rpcError) {
        console.error("Error en RPC fallback:", rpcError);
        return false;
      }
    }

    return profile?.is_admin || false;
  } catch (error) {
    console.error("Error in isAdminValidation:", error);
    return false;
  }
}
