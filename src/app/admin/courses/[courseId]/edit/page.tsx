import { createSSRClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Input from "@/components/Input";
import ImageUpload from "@/components/ImageUpload";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const supabase = await createSSRClient();

  // Obtener información del curso
  const { data: course } = await supabase
    .from("courses")
    .select("id, name, preview_image")
    .eq("id", courseId)
    .single();

  if (!course) {
    redirect("/admin/courses");
  }

  return (
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Editar Curso</h2>
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
          action="/admin/courses/actions"
          method="POST"
          className="space-y-6"
        >
          <input type="hidden" name="action" value="update" />
          <input type="hidden" name="courseId" value={course.id} />

          <div>
            <Input
              type="text"
              name="name"
              id="name"
              label="Nombre del Curso"
              defaultValue={course.name}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm"
            />
          </div>

          <ImageUpload
            name="preview_image"
            label="Imagen de Vista Previa del Curso"
            currentImage={course.preview_image || ""}
            className="mt-1"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[#7A7CFF] text-white rounded-md hover:bg-[#6A6CFF] transition-colors"
            >
              Actualizar Curso
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
