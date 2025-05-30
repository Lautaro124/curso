import { createSSRClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewModulePage({
  params,
}: {
  params: { courseId: string };
}) {
  const supabase = await createSSRClient();

  // Obtener información del curso
  const { data: course } = await supabase
    .from("courses")
    .select("name")
    .eq("id", params.courseId)
    .single();

  if (!course) {
    redirect("/admin/courses");
  }

  return (
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Agregar Módulo a {course.name}
          </h2>
          <Link
            href="/admin/courses"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Volver a Cursos
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <form
          action="/admin/modules/actions"
          method="POST"
          className="space-y-6"
        >
          <input type="hidden" name="action" value="create" />
          <input type="hidden" name="course_id" value={params.courseId} />

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre del Módulo
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_paid"
              id="is_paid"
              className="h-4 w-4 text-[#7A7CFF] focus:ring-[#7A7CFF] border-gray-300 rounded"
            />
            <label
              htmlFor="is_paid"
              className="ml-2 block text-sm text-gray-700"
            >
              Módulo de pago
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#7A7CFF] text-white rounded-md hover:bg-[#6A6CFF] transition-colors"
            >
              Crear Módulo
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
