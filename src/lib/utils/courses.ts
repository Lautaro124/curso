import { createSSRClient } from "../supabase/server";

export async function getAllCourses() {
  const supabase = await createSSRClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      name,
      preview_image,
      created_at,
      modules (
        id,
        name,
        is_paid,
        lessons (
          id,
          name,
          description,
          video_url
        )
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener los cursos:", error);
    return { enabled: [], disabled: [] };
  }

  // Separar cursos habilitados y deshabilitados
  const enabled = courses.filter((course) =>
    course.modules.some((module) => !module.is_paid)
  );
  const disabled = courses.filter((course) =>
    course.modules.every((module) => module.is_paid)
  );

  return { enabled, disabled };
}

export async function getUserCoursesWithModules(userId: string) {
  const supabase = await createSSRClient();


  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select(
      `
      id,
      name,
      preview_image,
      created_at
    `
    )
    .order("created_at", { ascending: false });

  if (coursesError) {
    console.error("Error al obtener los cursos:", coursesError);
    return [];
  }

  const { data: modules, error: modulesError } = await supabase.from("modules")
    .select(`
      id,
      name,
      is_paid,
      course_id
    `);

  if (modulesError) {
    console.error("Error al obtener los módulos:", modulesError);
    return [];
  }

  const { data: userModules, error: userModulesError } = await supabase
    .from("user_modules")
    .select("module_id")
    .eq("user_id", userId);

  if (userModulesError) {
    console.error(
      "Error al obtener los módulos del usuario:",
      userModulesError
    );
    return [];
  }


  // Crear un conjunto de IDs de módulos habilitados
  const enabledModuleIds = new Set(userModules?.map((m) => m.module_id) || []);

  // Agrupar módulos por curso
  const modulesByCourse = modules.reduce((acc, module) => {
    if (!acc[module.course_id]) {
      acc[module.course_id] = [];
    }
    acc[module.course_id].push(module);
    return acc;
  }, {} as Record<string, typeof modules>);


  // Construir el resultado
  const result = courses.map((course) => {
    const courseModules = modulesByCourse[course.id] || [];

    const enabledModules = courseModules
      .filter((module) => enabledModuleIds.has(module.id))
      .map((module) => ({
        id: module.id,
        name: module.name,
        is_paid: module.is_paid || false,
      }));

    const disabledModules = courseModules
      .filter((module) => !enabledModuleIds.has(module.id))
      .map((module) => ({
        id: module.id,
        name: module.name,
        is_paid: module.is_paid || false,
      }));

    return {
      course_id: course.id,
      course_name: course.name,
      course_preview_image: course.preview_image,
      enabled_modules: enabledModules,
      disabled_modules: disabledModules,
    };
  });


  return result;
}
