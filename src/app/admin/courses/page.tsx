import { createSSRClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const supabase = await createSSRClient();

  // Obtener todos los cursos con sus módulos y clases
  const { data: courses } = await supabase
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

  return (
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Gestión de Cursos
          </h2>
          <div className="flex gap-4">
            <Link
              href="/admin/users"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Gestionar Usuarios
            </Link>
            <Link
              href="/admin/courses/new"
              className="px-4 py-2 bg-[#7A7CFF] text-white rounded-md hover:bg-[#6A6CFF] transition-colors"
            >
              Crear Curso
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {courses?.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                {course.preview_image && (
                  <div className="relative h-16 w-16 flex-shrink-0">
                    <img
                      src={course.preview_image}
                      alt={course.name}
                      className="object-cover rounded-lg h-full w-full"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Creado el {new Date(course.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/courses/${course.id}/edit`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/admin/courses/${course.id}/modules/new`}
                    className="px-4 py-2 bg-[#7A7CFF] text-white rounded-md hover:bg-[#6A6CFF] transition-colors text-sm"
                  >
                    Agregar Módulo
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                {course.modules?.map((module) => (
                  <div key={module.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {module.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {module.is_paid
                            ? "Módulo de pago"
                            : "Módulo gratuito"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/modules/${module.id}/edit`}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                        >
                          Editar
                        </Link>
                        <Link
                          href={`/admin/modules/${module.id}/lessons/new`}
                          className="px-3 py-1 bg-[#7A7CFF] text-white rounded-md hover:bg-[#6A6CFF] transition-colors text-sm"
                        >
                          Agregar Clase
                        </Link>
                      </div>
                    </div>

                    {module.lessons && module.lessons.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between bg-white p-2 rounded"
                          >
                            <span className="text-sm text-gray-600">
                              {lesson.name}
                            </span>
                            <Link
                              href={`/admin/lessons/${lesson.id}/edit`}
                              className="text-[#7A7CFF] hover:text-[#6A6CFF] text-sm"
                            >
                              Editar
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
