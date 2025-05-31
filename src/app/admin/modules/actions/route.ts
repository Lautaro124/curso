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
  const action = formData.get("action") as string;

  if (action === "create") {
    const name = formData.get("name") as string;
    const course_id = formData.get("course_id") as string;
    const is_paid = formData.get("is_paid") === "on";

    // Crear el módulo
    const { data: module, error } = await supabase
      .from("modules")
      .insert({
        name,
        course_id,
        is_paid,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Error al crear el módulo" },
        { status: 500 }
      );
    }

    // Redirigir a la página para agregar la primera clase
    redirect(`/admin/modules/${module.id}/lessons/new`);
  }

  if (action === "update") {
    const moduleId = formData.get("moduleId") as string;
    const name = formData.get("name") as string;
    const is_paid = formData.get("is_paid") === "on";

    if (!moduleId || !name) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    try {
      // Actualizar el módulo directamente usando las políticas RLS
      const { error } = await supabase
        .from("modules")
        .update({
          name: name,
          is_paid: is_paid,
        })
        .eq("id", moduleId);

      if (error) {
        console.error("Error updating module:", error);
        return NextResponse.json(
          { error: "Error al actualizar el módulo" },
          { status: 500 }
        );
      }

      // Redirigir a la lista de cursos con un mensaje de éxito
      return NextResponse.redirect(new URL("/admin/courses", request.url));
    } catch (error) {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "Error inesperado al actualizar el módulo" },
        { status: 500 }
      );
    }
  }

  // Si no es una acción válida, redirigir a la lista de cursos
  redirect("/admin/courses");
}
