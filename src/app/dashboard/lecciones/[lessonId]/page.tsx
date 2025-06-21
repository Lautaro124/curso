import { createSSRClient } from "@/lib/supabase/server";
import { getLessonDetails, getLessonNavigation } from "@/lib/utils/modules";
import { redirect } from "next/navigation";
import Link from "next/link";
import { VideoPlayer } from "@/components/VideoPlayer";
import AttachmentDownload from "@/components/AttachmentDownload";

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

interface AttachmentFile {
  name: string;
  url: string;
}

interface QAItem {
  question: string;
  answer: string;
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
  const navigation = await getLessonNavigation(lessonId, user.id);

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
              <Link
                href={`/dashboard/modulos/${lessonDetail.module_id}`}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {lessonDetail.module_name}
              </Link>
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

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {lessonDetail.name}
        </h1>
        <p className="text-gray-600">
          {lessonDetail.course_name} • {lessonDetail.module_name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {lessonDetail.video_url && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Video de la lección
                  </h2>
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
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    HD Quality
                  </div>
                </div>
                <VideoPlayer
                  videoUrl={lessonDetail.video_url}
                  title={lessonDetail.name}
                />
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Utiliza los controles del reproductor para ajustar la
                    calidad y velocidad
                  </span>
                  <a
                    href={lessonDetail.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-[#7A7CFF] transition-colors"
                  >
                    Abrir en nueva pestaña
                    <svg
                      className="w-3 h-3"
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
          )}

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
        </div>{" "}
        <div className="lg:col-span-1">
          {lessonDetail.attachments &&
            Array.isArray(lessonDetail.attachments) &&
            lessonDetail.attachments.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Archivos adjuntos ({lessonDetail.attachments.length})
                  </h3>{" "}
                  <div className="space-y-3">
                    {lessonDetail.attachments.map(
                      (file: AttachmentFile, index: number) => (
                        <AttachmentDownload key={index} file={file} />
                      )
                    )}
                  </div>
                </div>
              </div>
            )}{" "}
          {lessonDetail.qa &&
            Array.isArray(lessonDetail.qa) &&
            lessonDetail.qa.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Preguntas y respuestas ({lessonDetail.qa.length})
                  </h3>
                  <div className="space-y-4">
                    {lessonDetail.qa.map((qaItem: QAItem, index: number) => (
                      <div
                        key={index}
                        className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg"
                      >
                        <div className="mb-3">
                          <div className="flex items-start gap-2">
                            <svg
                              className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
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
                            <div>
                              <h4 className="font-medium text-blue-800 text-sm">
                                Pregunta
                              </h4>
                              <p className="text-blue-700 text-sm mt-1">
                                {qaItem.question}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-6">
                          <div className="flex items-start gap-2">
                            <svg
                              className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <div>
                              <h4 className="font-medium text-green-800 text-sm">
                                Respuesta
                              </h4>
                              <p className="text-green-700 text-sm mt-1">
                                {qaItem.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Navegación entre lecciones */}
      <div className="mt-8 flex justify-between items-center">
        <div className="flex-1">
          {navigation.previous ? (
            <Link
              href={`/dashboard/lecciones/${navigation.previous.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <div className="text-left">
                <div className="text-xs text-gray-500">Lección anterior</div>
                <div className="font-medium">{navigation.previous.name}</div>
              </div>
            </Link>
          ) : (
            <div></div>
          )}
        </div>

        <div className="flex-1 text-right">
          {navigation.next ? (
            <Link
              href={`/dashboard/lecciones/${navigation.next.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#7A7CFF] hover:bg-[#6B6DFF] text-white rounded-lg transition-colors"
            >
              <div className="text-right">
                <div className="text-xs text-blue-100">Siguiente lección</div>
                <div className="font-medium">{navigation.next.name}</div>
              </div>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </main>
  );
}
