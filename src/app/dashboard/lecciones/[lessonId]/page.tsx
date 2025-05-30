import { createSSRClient } from "@/lib/supabase/server";
import { getLessonDetails } from "@/lib/utils/modules";
import { redirect } from "next/navigation";
import Link from "next/link";

type LessonDetail = {
  id: string;
  name: string;
  description: string | null;
  video_url: string | null;
  attachments: any;
  qa: any;
  module_name: string;
  course_name: string;
};

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonDetailPage({ params }: PageProps) {
  const { lessonId } = await params;
  const supabase = await createSSRClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const lessonDetail = await getLessonDetails(lessonId, user.id);

  if (!lessonDetail) {
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
              <span className="text-gray-500 hover:text-gray-700">
                {lessonDetail.module_name}
              </span>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">
                {lessonDetail.name}
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Lesson Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {lessonDetail.name}
        </h1>
        <p className="text-gray-600">
          {lessonDetail.course_name} • {lessonDetail.module_name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Video Section */}
          {lessonDetail.video_url && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Video de la lección
                </h2>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
                    <p className="text-gray-600 mb-2">Video disponible</p>
                    <a
                      href={lessonDetail.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-[#7A7CFF] text-white rounded-md hover:bg-[#6A6CFF] transition-colors"
                    >
                      Ver video
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Description Section */}
          {lessonDetail.description && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Descripción
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {lessonDetail.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Attachments Section */}
          {lessonDetail.attachments && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Archivos adjuntos
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-gray-600"
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
                    <span className="text-sm text-gray-700">
                      Material de apoyo disponible
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Q&A Section */}
          {lessonDetail.qa && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Preguntas y respuestas
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-blue-600"
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
                    <span className="text-sm text-blue-700">
                      Sección de Q&A disponible
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
