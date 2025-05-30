import { createSSRClient } from "@/lib/supabase/server";
import { isAdminValidation } from "@/lib/utils/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createSSRClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if(!user){
    return NextResponse.redirect(new URL("/", request.url))
  }

  const isAdmin = await isAdminValidation(user.id)
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
    // const attachments = formData.get("attachments") as string;

    if (!moduleId || !name) {
      return new NextResponse("Faltan datos requeridos", { status: 400 });
    }

    try {
      const { error } = await supabase.from("lessons").insert({
        module_id: moduleId,
        name,
        description,
        video_url: videoUrl || null,
        attachments:  null,
        qa: null,
      });

      if (error) throw error;

      return NextResponse.redirect(new URL("/admin/courses", request.url));
    } catch (error) {
      console.error("Error al crear la clase:", error);
      return new NextResponse("Error al crear la clase", { status: 500 });
    }
  }

  return new NextResponse("Acción no válida", { status: 400 });
}
