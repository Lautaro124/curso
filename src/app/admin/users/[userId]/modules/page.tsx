import { createSSRClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserModulesPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createSSRClient();

  // Verificar si el usuario es administrador
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/");
  }

  // Obtener información del usuario
  const { data: targetUser } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();

  if (!targetUser) {
    redirect("/admin/users");
  }

  // Obtener todos los cursos con sus módulos
  const { data: courses } = await supabase
    .from("courses")
    .select(
      `
      id,
      name,
      preview_image,
      modules (
        id,
        name,
        is_paid
      )
    `
    )
    .order("created_at", { ascending: false });

  // Obtener los módulos habilitados para el usuario
  const { data: enabledModules } = await supabase
    .from("user_modules")
    .select("module_id")
    .eq("user_id", userId);

  const enabledModuleIds = new Set(
    enabledModules?.map((m) => m.module_id) || []
  );

  return (
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Módulos de {targetUser.full_name}
          </h2>
          <Link
            href="/admin/users"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Volver a Usuarios
          </Link>
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
                <h3 className="text-xl font-semibold text-gray-800">
                  {course.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.modules?.map((module) => {
                  const isEnabled = enabledModuleIds.has(module.id);
                  return (
                    <div
                      key={module.id}
                      className={`p-4 rounded-lg border ${
                        isEnabled
                          ? "bg-green-50 border-green-100"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span
                            className={`font-medium ${
                              isEnabled ? "text-green-800" : "text-gray-800"
                            }`}
                          >
                            {module.name}
                          </span>
                          <p
                            className={`text-sm ${
                              isEnabled ? "text-green-600" : "text-gray-500"
                            }`}
                          >
                            {module.is_paid
                              ? "Módulo de pago"
                              : "Módulo gratuito"}
                          </p>
                        </div>
                        <form
                          action="/admin/users/actions"
                          method="POST"
                          className="flex items-center"
                        >
                          <input type="hidden" name="userId" value={userId} />
                          <input
                            type="hidden"
                            name="moduleId"
                            value={module.id}
                          />
                          <input
                            type="hidden"
                            name="action"
                            value={isEnabled ? "disable" : "enable"}
                          />
                          <button
                            type="submit"
                            className={`px-4 py-2 rounded-md text-sm transition-colors ${
                              isEnabled
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-[#7A7CFF] text-white hover:bg-[#6A6CFF]"
                            }`}
                          >
                            {isEnabled ? "Deshabilitar" : "Habilitar"}
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
