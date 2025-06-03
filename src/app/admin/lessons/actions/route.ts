import { createSSRClient } from "@/lib/supabase/server";
import { isAdminValidation } from "@/lib/utils/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createSSRClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isAdmin = await isAdminValidation(user.id);
  if (!isAdmin) {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "create") {
    const moduleId = formData.get("module_id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const videoUrl = formData.get("video_url") as string;
    const attachments = formData.get("attachments") as string;
    const qa = formData.get("qa") as string;

    if (!moduleId || !name) {
      return new NextResponse("Faltan datos requeridos", { status: 400 });
    }

    try {
      // Parsear attachments si hay datos
      let parsedAttachments = null;
      let parsedQa = null;

      if (attachments && attachments.trim()) {
        try {
          parsedAttachments = JSON.parse(attachments);
          // Validar que sea un array
          if (!Array.isArray(parsedAttachments)) {
            return new NextResponse("Attachments debe ser un array", {
              status: 400,
            });
          }

          // Validar estructura de cada archivo
          for (const file of parsedAttachments) {
            if (!file.name || !file.url) {
              return new NextResponse(
                "Cada archivo debe tener 'name' y 'url'",
                {
                  status: 400,
                }
              );
            }
          }
        } catch {
          return new NextResponse("Formato JSON inválido en attachments", {
            status: 400,
          });
        }
      }

      if (qa && qa.trim()) {
        try {
          parsedQa = JSON.parse(qa);
          // Validar que sea un array de objetos con question y answer
          if (!Array.isArray(parsedQa)) {
            return new NextResponse("Q&A debe ser un array", {
              status: 400,
            });
          }

          // Validar estructura de cada pregunta
          for (const qaItem of parsedQa) {
            if (!qaItem.question || !qaItem.answer) {
              return new NextResponse(
                "Cada pregunta debe tener 'question' y 'answer'",
                {
                  status: 400,
                }
              );
            }
          }
        } catch {
          return new NextResponse("Formato JSON inválido en Q&A", {
            status: 400,
          });
        }
      }

      const { error } = await supabase.from("lessons").insert({
        module_id: moduleId,
        name,
        description,
        video_url: videoUrl || null,
        attachments: parsedAttachments,
        qa: parsedQa,
      });

      if (error) throw error;

      return NextResponse.redirect(new URL("/admin/courses", request.url));
    } catch (error) {
      console.error("Error al crear la clase:", error);
      return new NextResponse("Error al crear la clase", { status: 500 });
    }
  }

  if (action === "update") {
    const lessonId = formData.get("lessonId") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const videoUrl = formData.get("video_url") as string;
    const attachments = formData.get("attachments") as string;
    const qa = formData.get("qa") as string;

    if (!lessonId || !name) {
      return new NextResponse("Faltan datos requeridos", { status: 400 });
    }

    try {
      // Parsear JSON si hay datos
      let parsedAttachments = null;
      let parsedQa = null;

      if (attachments && attachments.trim()) {
        try {
          parsedAttachments = JSON.parse(attachments);
          // Validar que sea un array de objetos con name y url
          if (!Array.isArray(parsedAttachments)) {
            return new NextResponse("Attachments debe ser un array", {
              status: 400,
            });
          }

          // Validar estructura de cada archivo
          for (const file of parsedAttachments) {
            if (!file.name || !file.url) {
              return new NextResponse(
                "Cada archivo debe tener 'name' y 'url'",
                {
                  status: 400,
                }
              );
            }
          }
        } catch {
          return new NextResponse("Formato JSON inválido en attachments", {
            status: 400,
          });
        }
      }

      if (qa && qa.trim()) {
        try {
          parsedQa = JSON.parse(qa);
          // Validar que sea un array de objetos con question y answer
          if (!Array.isArray(parsedQa)) {
            return new NextResponse("Q&A debe ser un array", {
              status: 400,
            });
          }

          // Validar estructura de cada pregunta
          for (const qaItem of parsedQa) {
            if (!qaItem.question || !qaItem.answer) {
              return new NextResponse(
                "Cada pregunta debe tener 'question' y 'answer'",
                {
                  status: 400,
                }
              );
            }
          }
        } catch {
          return new NextResponse("Formato JSON inválido en Q&A", {
            status: 400,
          });
        }
      }

      const { error } = await supabase
        .from("lessons")
        .update({
          name,
          description: description || null,
          video_url: videoUrl || null,
          attachments: parsedAttachments,
          qa: parsedQa,
        })
        .eq("id", lessonId);

      if (error) throw error;

      return NextResponse.redirect(new URL("/admin/courses", request.url));
    } catch (error) {
      console.error("Error al actualizar la lección:", error);
      return new NextResponse("Error al actualizar la lección", {
        status: 500,
      });
    }
  }

  return new NextResponse("Acción no válida", { status: 400 });
}
