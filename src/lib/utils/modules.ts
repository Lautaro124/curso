import { createSSRClient } from "../supabase/server";

export async function getModuleWithLessons(moduleId: string, userId: string) {
  const supabase = await createSSRClient();

  console.log(
    "Obteniendo detalles del módulo:",
    moduleId,
    "para usuario:",
    userId
  );

  // Verificar si el usuario tiene acceso al módulo
  const { data: userModule } = await supabase
    .from("user_modules")
    .select("id")
    .eq("user_id", userId)
    .eq("module_id", moduleId)
    .single();

  if (!userModule) {
    console.log("Usuario no tiene acceso al módulo");
    return null;
  }

  // Obtener los detalles del módulo con sus lecciones
  const { data: moduleDetail, error } = await supabase
    .from("modules")
    .select(
      `
      id,
      name,
      is_paid,
      courses!inner (
        name
      ),
      lessons (
        id,
        name,
        description,
        video_url,
        attachments,
        qa,
        created_at
      )
    `
    )
    .eq("id", moduleId)
    .single();

  if (error) {
    console.error("Error al obtener detalles del módulo:", error);
    return null;
  }

  if (!moduleDetail) {
    return null;
  }

  // Transformar la respuesta para que coincida con el tipo esperado
  const result = {
    id: moduleDetail.id,
    name: moduleDetail.name,
    is_paid: moduleDetail.is_paid,
    course_name: moduleDetail.courses.name,
    lessons: moduleDetail.lessons.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ),
  };

  console.log("Detalles del módulo obtenidos:", result);
  return result;
}

export async function getLessonDetails(lessonId: string, userId: string) {
  const supabase = await createSSRClient();

  console.log(
    "Obteniendo detalles de la lección:",
    lessonId,
    "para usuario:",
    userId
  );

  // Primero verificar si el usuario tiene acceso a esta lección a través del módulo
  const { data: lessonAccess, error: accessError } = await supabase
    .from("lessons")
    .select(
      `
      id,
      name,
      description,
      video_url,
      attachments,
      qa,
      modules!inner (
        id,
        name,
        courses!inner (
          name
        ),
        user_modules!inner (
          user_id
        )
      )
    `
    )
    .eq("id", lessonId)
    .eq("modules.user_modules.user_id", userId)
    .single();

  if (accessError || !lessonAccess) {
    console.log("Usuario no tiene acceso a esta lección:", accessError);
    return null;
  }

  const result = {
    id: lessonAccess.id,
    name: lessonAccess.name,
    description: lessonAccess.description,
    video_url: lessonAccess.video_url,
    attachments: lessonAccess.attachments,
    qa: lessonAccess.qa,
    module_name: lessonAccess.modules.name,
    course_name: lessonAccess.modules.courses.name,
  };

  console.log("Detalles de la lección obtenidos:", result);
  return result;
}
