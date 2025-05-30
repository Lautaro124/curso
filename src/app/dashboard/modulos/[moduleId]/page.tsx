import { createSSRClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getModuleWithLessons } from "@/lib/utils/modules";

type Lesson = {
  id: string;
  name: string;
  description: string | null;
  video_url: string | null;
  attachments: Record<string, unknown> | null;
  qa: Record<string, unknown> | null;
};

interface PageProps {
  params: Promise<{ moduleId: string }>;
}

export default async function ModuleDetailPage({ params }: PageProps) {
  const { moduleId } = await params;
  const supabase = await createSSRClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const moduleDetail = await getModuleWithLessons(moduleId, user.id);

  if (!moduleDetail) {
    redirect("/dashboard");
  }

  return (
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link
                href="/dashboard"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">
                {moduleDetail.name}
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Module Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {moduleDetail.name}
            </h1>
            <p className="text-gray-600">Curso: {moduleDetail.course_name}</p>
            {moduleDetail.is_paid && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                Módulo Premium
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Lecciones ({moduleDetail.lessons.length})
          </h2>

          {moduleDetail.lessons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Este módulo aún no tiene lecciones disponibles.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {moduleDetail.lessons.map((lesson: Lesson, index: number) => (
                <div
                  key={lesson.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center justify-center w-8 h-8 bg-[#7A7CFF] text-white rounded-full text-sm font-medium">
                          {index + 1}
                        </span>
                        <h3 className="text-lg font-medium text-gray-800">
                          {lesson.name}
                        </h3>
                      </div>

                      {lesson.description && (
                        <p className="text-gray-600 mb-3 ml-11">
                          {lesson.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 ml-11">
                        {lesson.video_url && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-4h1M9 18h6m-7 0h1m6 0h1M6 10h1m6 0h1m-8 4h1m8 0h1"
                              />
                            </svg>
                            Video disponible
                          </div>
                        )}

                        {lesson.attachments && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                            Archivos adjuntos
                          </div>
                        )}

                        {lesson.qa && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Q&A disponible
                          </div>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/lecciones/${lesson.id}`}
                      className="px-4 py-2 bg-[#7A7CFF] text-white rounded-md hover:bg-[#6A6CFF] transition-colors text-sm font-medium"
                    >
                      Ver lección
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
