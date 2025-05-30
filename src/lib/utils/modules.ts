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

  // Obtener los detalles del módulo
  const { data: moduleDetail, error } = await supabase
    .from("modules")
    .select("id, name, is_paid, course_id")
    .eq("id", moduleId)
    .single();

  if (error || !moduleDetail) {
    console.error("Error al obtener detalles del módulo:", error);
    return null;
  }

  // Obtener el curso asociado
  const { data: course } = await supabase
    .from("courses")
    .select("name")
    .eq("id", moduleDetail.course_id)
    .single();

  // Obtener las lecciones del módulo
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, name, description, video_url, attachments, qa, created_at")
    .eq("module_id", moduleId)
    .order("created_at", { ascending: true });

  const result = {
    id: moduleDetail.id,
    name: moduleDetail.name,
    is_paid: moduleDetail.is_paid,
    course_name: course?.name || "Curso no encontrado",
    lessons: lessons || [],
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

  // Obtener la lección
  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id, name, description, video_url, attachments, qa, module_id")
    .eq("id", lessonId)
    .single();

  if (lessonError || !lesson) {
    console.log("Error al obtener la lección:", lessonError);
    return null;
  }

  // Verificar si el usuario tiene acceso al módulo de esta lección
  const { data: userModule } = await supabase
    .from("user_modules")
    .select("id")
    .eq("user_id", userId)
    .eq("module_id", lesson.module_id)
    .single();

  if (!userModule) {
    console.log("Usuario no tiene acceso a esta lección");
    return null;
  }

  // Obtener información del módulo
  const { data: module } = await supabase
    .from("modules")
    .select("name, course_id")
    .eq("id", lesson.module_id)
    .single();

  // Obtener información del curso
  const { data: course } = await supabase
    .from("courses")
    .select("name")
    .eq("id", module?.course_id)
    .single();

  const result = {
    id: lesson.id,
    name: lesson.name,
    description: lesson.description,
    video_url: lesson.video_url,
    attachments: lesson.attachments,
    qa: lesson.qa,
    module_id: lesson.module_id,
    module_name: module?.name || "Módulo no encontrado",
    course_name: course?.name || "Curso no encontrado",
  };

  console.log("Detalles de la lección obtenidos:", result);
  return result;
}

export async function getModuleLessons(moduleId: string, userId: string) {
  const supabase = await createSSRClient();

  console.log(
    "Obteniendo lecciones del módulo:",
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
    return [];
  }

  // Obtener todas las lecciones del módulo
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("id, name, description, video_url, created_at")
    .eq("module_id", moduleId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error al obtener lecciones del módulo:", error);
    return [];
  }

  console.log("Lecciones del módulo obtenidas:", lessons);
  return lessons || [];
}

export async function getLessonNavigation(lessonId: string, userId: string) {
  const supabase = await createSSRClient();

  console.log(
    "Obteniendo navegación para la lección:",
    lessonId,
    "para usuario:",
    userId
  );

  // Obtener la lección actual
  const { data: currentLesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id, name, module_id, created_at")
    .eq("id", lessonId)
    .single();

  if (lessonError || !currentLesson) {
    console.log("Error al obtener la lección actual:", lessonError);
    return { previous: null, next: null };
  }

  // Verificar si el usuario tiene acceso al módulo
  const { data: userModule } = await supabase
    .from("user_modules")
    .select("id")
    .eq("user_id", userId)
    .eq("module_id", currentLesson.module_id)
    .single();

  if (!userModule) {
    console.log("Usuario no tiene acceso a esta lección");
    return { previous: null, next: null };
  }

  // Obtener todas las lecciones del módulo ordenadas por fecha de creación
  const { data: allLessons, error } = await supabase
    .from("lessons")
    .select("id, name, created_at")
    .eq("module_id", currentLesson.module_id)
    .order("created_at", { ascending: true });

  if (error || !allLessons) {
    console.error("Error al obtener todas las lecciones:", error);
    return { previous: null, next: null };
  }

  // Encontrar el índice de la lección actual
  const currentIndex = allLessons.findIndex((lesson) => lesson.id === lessonId);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  const navigation = {
    previous: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
    next:
      currentIndex < allLessons.length - 1
        ? allLessons[currentIndex + 1]
        : null,
  };

  console.log("Navegación obtenida:", navigation);
  return navigation;
}
