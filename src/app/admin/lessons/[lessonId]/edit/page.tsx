import { createSSRClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";

export default async function EditLessonPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const supabase = await createSSRClient();

  // Obtener información de la lección, módulo y curso
  const { data: lesson } = await supabase
    .from("lessons")
    .select(
      `
      id,
      name,
      description,
      video_url,
      attachments,
      qa,
      module_id,
      modules (
        id,
        name,
        courses (
          id,
          name
        )
      )
    `
    )
    .eq("id", params.lessonId)
    .single();

  if (!lesson) {
    redirect("/admin/courses");
  }

  const moduleData = Array.isArray(lesson.modules)
    ? lesson.modules[0]
    : lesson.modules;
  const courseData = moduleData?.courses
    ? Array.isArray(moduleData.courses)
      ? moduleData.courses[0]
      : moduleData.courses
    : null;

  return (
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Editar Lección</h2>
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
            Curso: {courseData?.name || "Curso no encontrado"}
          </h3>
          <h4 className="text-md font-medium text-gray-600 mb-2">
            Módulo: {moduleData?.name || "Módulo no encontrado"}
          </h4>
          <p className="text-sm text-gray-600">Editando lección del módulo</p>
        </div>

        <form
          action="/admin/lessons/actions"
          method="POST"
          className="space-y-6"
        >
          <input type="hidden" name="action" value="update" />
          <input type="hidden" name="lessonId" value={lesson.id} />
          <input type="hidden" name="moduleId" value={lesson.module_id} />

          <div>
            <Input
              type="text"
              name="name"
              id="name"
              label="Nombre de la Lección"
              defaultValue={lesson.name}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm"
            />
          </div>

          <div>
            <Textarea
              name="description"
              id="description"
              label="Descripción (Markdown)"
              defaultValue={lesson.description || ""}
              rows={5}
              placeholder="Describe el contenido de la lección..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm"
            />
          </div>

          <div>
            <Input
              type="url"
              name="video_url"
              id="video_url"
              label="URL del Video"
              defaultValue={lesson.video_url || ""}
              placeholder="https://ejemplo.com/video.mp4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm"
            />
          </div>

          <div>
            <Textarea
              name="attachments"
              id="attachments"
              label="Archivos Adjuntos (JSON)"
              defaultValue={
                lesson.attachments
                  ? JSON.stringify(lesson.attachments, null, 2)
                  : ""
              }
              rows={3}
              placeholder='[{"name": "Documento PDF", "url": "https://example.com/doc.pdf"}]'
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm"
            />
          </div>

          <div>
            <Textarea
              name="qa"
              id="qa"
              label="Preguntas y Respuestas (JSON)"
              defaultValue={lesson.qa ? JSON.stringify(lesson.qa, null, 2) : ""}
              rows={3}
              placeholder='[{"question": "¿Pregunta 1?", "answer": "Respuesta 1"}]'
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[#7A7CFF] text-white rounded-md hover:bg-[#6A6CFF] transition-colors"
            >
              Actualizar Lección
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
