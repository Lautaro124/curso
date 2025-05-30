import { createSSRClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { isAdminValidation } from "@/lib/utils/user";

export async function POST(request: Request) {
  const supabase = await createSSRClient();

  // Verificar si el usuario es administrador
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const isAdmin = await isAdminValidation(user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const moduleId = formData.get("moduleId") as string;
  const action = formData.get("action") as string;

  if (action === "enable") {
    // Habilitar módulo
    const { error } = await supabase.from("user_modules").insert({
      user_id: userId,
      module_id: moduleId,
    });

    if (error) {
      return NextResponse.json(
        { error: "Error al habilitar el módulo" },
        { status: 500 }
      );
    }
  } else if (action === "disable") {
    // Deshabilitar módulo
    const { error } = await supabase.from("user_modules").delete().match({
      user_id: userId,
      module_id: moduleId,
    });

    if (error) {
      return NextResponse.json(
        { error: "Error al deshabilitar el módulo" },
        { status: 500 }
      );
    }
  }

  // Redirigir de vuelta a la página de módulos del usuario
  return NextResponse.redirect(
    new URL(`/admin/users/${userId}/modules`, request.url)
  );
}
