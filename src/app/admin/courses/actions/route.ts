import { createSSRClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { isAdminValidation } from "@/lib/utils/user";

export async function POST(request: Request) {
  const supabase = await createSSRClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if(!user){
    redirect('/')
  }

  const isAdmin = await isAdminValidation(user.id)

  if (!isAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const formData = await request.formData();
  const action = formData.get("action") as string;

  if (action === "create") {
    const name = formData.get("name") as string;
    const preview_image = formData.get("preview_image") as string;

    // Crear el curso
    const { data: course, error } = await supabase
      .from("courses")
      .insert({
        name,
        preview_image: preview_image || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Error al crear el curso" },
        { status: 500 }
      );
    }

    // Redirigir a la página para agregar el primer módulo
    redirect(`/admin/courses/${course.id}/modules/new`);
  }

  // Si no es una acción válida, redirigir a la lista de cursos
  redirect("/admin/courses");
}
