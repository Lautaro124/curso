import { createSSRClient } from "@/lib/supabase/server";
import { getUserCoursesWithModules } from "@/lib/utils/courses";
import Link from "next/link";
import Image from "next/image";

type Course = {
  course_id: string;
  course_name: string;
  course_preview_image: string | null;
  enabled_modules: Array<{
    id: string;
    name: string;
    is_paid: boolean;
  }>;
  disabled_modules: Array<{
    id: string;
    name: string;
    is_paid: boolean;
  }>;
};

export default async function Dashboard() {
  const supabase = await createSSRClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const courses = await getUserCoursesWithModules(user?.id || "");

  return (
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Bienvenido, {user?.user_metadata?.full_name || "Usuario"}
        </h2>
        <p className="text-gray-600">
          Aquí podrás ver tus módulos disponibles.
        </p>
      </div>

      <div className="space-y-8">
        {courses?.map((course: Course) => (
          <div
            key={course.course_id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                {course.course_preview_image && (
                  <Image
                    src={course.course_preview_image}
                    alt={course.course_name}
                    className="object-cover rounded-lg h-full w-full"
                    fill={false}
                    width={64}
                    height={64}
                    style={{ objectFit: "cover", borderRadius: "0.5rem" }}
                    unoptimized={false}
                  />
                )}
                <h3 className="text-xl font-semibold text-gray-800">
                  {course.course_name}
                </h3>
              </div>

              {/* Módulos habilitados */}
              {course.enabled_modules.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    Módulos habilitados
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.enabled_modules.map((module) => (
                      <div
                        key={module.id}
                        className="bg-green-50 p-4 rounded-lg border border-green-100"
                      >
                        {" "}
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-green-800">
                            {module.name}
                          </span>
                          <Link
                            href={`/dashboard/modulos/${module.id}`}
                            className="px-4 py-2 bg-[#7A7CFF] text-white rounded-md hover:bg-[#6A6CFF] transition-colors text-sm"
                          >
                            Ver módulo
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Módulos no habilitados */}
              {course.disabled_modules.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    Módulos disponibles
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.disabled_modules.map((module) => (
                      <div
                        key={module.id}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                      >
                        {" "}
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-600">
                            {module.name}
                          </span>
                          <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-sm">
                            No disponible
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
