import { createSSRClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { isAdminValidation } from "@/lib/utils/user";

export async function POST(request: Request) {
  const supabase = await createSSRClient();
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
    const preview_image = formData.get("preview_image") as string;

    // Validar que el nombre no esté vacío
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "El nombre del curso es requerido" },
        { status: 400 }
      );
    }

    let courseId: string;

    try {
      // Crear el curso
      const { data: course, error } = await supabase
        .from("courses")
        .insert({
          name: name.trim(),
          preview_image:
            preview_image && preview_image.trim() !== "" ? preview_image : null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error específico al crear curso:", error);
        return NextResponse.json(
          {
            error: "Error al crear el curso",
            details: error.message,
            code: error.code,
          },
          { status: 500 }
        );
      }

      if (!course) {
        console.error("No se devolvió el curso creado");
        return NextResponse.json(
          { error: "Error al crear el curso - datos no devueltos" },
          { status: 500 }
        );
      }

      courseId = course.id;
    } catch (error) {
      console.error("Error inesperado al crear curso:", error);
      return NextResponse.json(
        {
          error: "Error interno del servidor",
          details: error instanceof Error ? error.message : "Error desconocido",
        },
        { status: 500 }
      );
    }

    // Redirigir fuera del try-catch
    redirect(`/admin/courses/${courseId}/modules/new`);
  }

  if (action === "update") {
    const courseId = formData.get("courseId") as string;
    const name = formData.get("name") as string;
    const preview_image = formData.get("preview_image") as string;

    if (!courseId) {
      return NextResponse.json(
        { error: "ID del curso es requerido" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "El nombre del curso es requerido" },
        { status: 400 }
      );
    }

    try {
      // Primero verificar si el curso existe
      const { data: existingCourse, error: fetchError } = await supabase
        .from("courses")
        .select("id")
        .eq("id", courseId)
        .single();

      if (fetchError || !existingCourse) {
        console.error("Error al buscar el curso:", fetchError);
        return NextResponse.json(
          { error: "Curso no encontrado" },
          { status: 404 }
        );
      }

      // Actualizar el curso
      const { error } = await supabase
        .from("courses")
        .update({
          name,
          preview_image: preview_image || null,
        })
        .eq("id", courseId);

      if (error) {
        console.error("Error específico al actualizar:", error);

        // Si el error es de permisos, intentar con bypass RLS
        if (
          error.message.includes("permission denied") ||
          error.message.includes("insufficient_privilege")
        ) {
          const { error: adminError } = await supabase.rpc(
            "update_course_as_admin",
            {
              course_id: courseId,
              course_name: name,
              course_preview_image: preview_image || null,
            }
          );

          if (adminError) {
            console.error("Error con RPC admin:", adminError);
            return NextResponse.json(
              {
                error: "Error al actualizar el curso",
                details: `RLS Error: ${error.message}, RPC Error: ${adminError.message}`,
              },
              { status: 500 }
            );
          }
        } else {
          return NextResponse.json(
            {
              error: "Error al actualizar el curso",
              details: error.message,
            },
            { status: 500 }
          );
        }
      } else {
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }

    // Redirigir después de actualización exitosa (fuera del try-catch)
    redirect("/admin/courses");
  }

  // Si no es una acción válida, redirigir a la lista de cursos
  redirect("/admin/courses");
}
