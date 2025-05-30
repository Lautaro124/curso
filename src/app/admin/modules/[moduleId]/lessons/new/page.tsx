import { createSSRClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewLessonPage({
  params,
}: {
  params: { moduleId: string };
}) {
  const supabase = await createSSRClient();

  const { data: module } = await supabase
    .from("modules")
    .select(
      `
      name,
      courses (
        id,
        name
      )
    `
    )
    .eq("id", params.moduleId)
    .single();

  if (!module) {
    redirect("/admin/courses");
  }

  return (
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Agregar Clase a {module.name}
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
          action="/admin/lessons/actions"
          method="POST"
          className="space-y-6"
        >
          <input type="hidden" name="action" value="create" />
          <input type="hidden" name="module_id" value={params.moduleId} />

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre de la Clase
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción (Markdown)
            </label>
            <textarea
              name="description"
              id="description"
              rows={5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="video_url"
              className="block text-sm font-medium text-gray-700"
            >
              URL del Video
            </label>
            <input
              type="url"
              name="video_url"
              id="video_url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="attachments"
              className="block text-sm font-medium text-gray-700"
            >
              Archivos Adjuntos (JSON)
            </label>
            <textarea
              name="attachments"
              id="attachments"
              rows={3}
              placeholder='[{"name": "Documento PDF", "url": "https://example.com/doc.pdf"}]'
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="qa"
              className="block text-sm font-medium text-gray-700"
            >
              Preguntas y Respuestas (JSON)
            </label>
            <textarea
              name="qa"
              id="qa"
              rows={3}
              placeholder='[{"question": "¿Pregunta 1?", "answer": "Respuesta 1"}]'
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#7A7CFF] text-white rounded-md hover:bg-[#6A6CFF] transition-colors"
            >
              Crear Clase
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
