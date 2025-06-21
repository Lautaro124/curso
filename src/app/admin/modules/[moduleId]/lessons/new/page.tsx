import { createSSRClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import FileUpload from "@/components/FileUpload";
import QAEditor from "@/components/QAEditor";

export default async function NewLessonPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
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
    .eq("id", moduleId)
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
          <Input type="hidden" name="action" value="create" label={""} />{" "}
          <Input type="hidden" name="module_id" value={moduleId} label={""} />{" "}
          <Input
            name="name"
            id="name"
            type="text"
            label="Nombre de la Clase"
            required
          />{" "}
          <Textarea
            name="description"
            id="description"
            label="Descripción (Markdown)"
            rows={5}
          />{" "}
          <Input
            name="video_url"
            id="video_url"
            type="url"
            label="URL del Video"
          />{" "}
          <FileUpload
            name="attachments"
            label="Archivos Adjuntos"
            className="mt-1"
          />
          <QAEditor name="qa" label="Preguntas y Respuestas" className="mt-1" />
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
