import { createSSRClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import Input from "@/components/Input";

export default async function EditModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const supabase = await createSSRClient();

  // Obtener información del módulo y su curso
  const { data: module } = await supabase
    .from("modules")
    .select(
      `
      id, 
      name, 
      is_paid,
      course_id
    `
    )
    .eq("id", moduleId)
    .single();

  if (!module) {
    redirect("/admin/courses");
  }

  // Obtener información del curso
  const { data: course } = await supabase
    .from("courses")
    .select("id, name")
    .eq("id", module.course_id)
    .single();

  return (
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Editar Módulo</h2>
          <Link
            href="/admin/courses"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Volver a Cursos
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Curso: {course?.name || "Curso no encontrado"}
          </h3>
          <p className="text-sm text-gray-600">Editando módulo del curso</p>
        </div>

        <form
          action="/admin/modules/actions"
          method="POST"
          className="space-y-6"
        >
          <input type="hidden" name="action" value="update" />
          <input type="hidden" name="moduleId" value={module.id} />
          <input type="hidden" name="courseId" value={module.course_id} />

          <div>
            <Input
              type="text"
              name="name"
              id="name"
              label="Nombre del Módulo"
              defaultValue={module.name}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_paid"
              id="is_paid"
              defaultChecked={module.is_paid}
              className="h-4 w-4 text-[#7A7CFF] focus:ring-[#7A7CFF] border-gray-300 rounded"
            />
            <label
              htmlFor="is_paid"
              className="ml-2 block text-sm text-gray-900"
            >
              Módulo de pago
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[#7A7CFF] text-white rounded-md hover:bg-[#6A6CFF] transition-colors"
            >
              Actualizar Módulo
            </button>
            <Link
              href="/admin/courses"
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
