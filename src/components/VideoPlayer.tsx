"use client";

import { useState } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Función para detectar el tipo de video
  const getVideoType = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return "youtube";
    }
    if (url.includes("vimeo.com")) {
      return "vimeo";
    }
    if (url.includes(".mp4") || url.includes(".mov") || url.includes(".webm")) {
      return "direct";
    }
    return "iframe"; // Para otros casos
  };

  // Función para obtener el ID de YouTube
  const getYouTubeId = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Función para obtener el ID de Vimeo
  const getVimeoId = (url: string) => {
    const regex =
      /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(regex);
    return match ? match[3] : null;
  };

  const videoType = getVideoType(videoUrl);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const renderVideo = () => {
    if (hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-gray-600 mb-2">Error al cargar el video</p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#7A7CFF] text-white rounded-md hover:bg-[#6A6CFF] transition-colors text-sm"
          >
            Abrir en nueva pestaña
          </a>
        </div>
      );
    }

    switch (videoType) {
      case "youtube":
        const youtubeId = getYouTubeId(videoUrl);
        if (!youtubeId) return null;
        return (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=0&fs=1&cc_load_policy=1&iv_load_policy=3`}
            className="w-full h-full rounded-lg"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={title || "Video de la lección"}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        );

      case "vimeo":
        const vimeoId = getVimeoId(videoUrl);
        if (!vimeoId) return null;
        return (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&responsive=1`}
            className="w-full h-full rounded-lg"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            title={title || "Video de la lección"}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        );

      case "direct":
        return (
          <video
            controls
            className="w-full h-full rounded-lg"
            preload="metadata"
            onLoadedData={() => setIsLoading(false)}
            onError={handleIframeError}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/mov" />
            Tu navegador no soporta el elemento de video.
          </video>
        );

      case "iframe":
      default:
        return (
          <iframe
            src={videoUrl}
            className="w-full h-full rounded-lg"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={title || "Video de la lección"}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        );
    }
  };

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A7CFF] mb-4"></div>
            <p className="text-gray-600">Cargando video...</p>
          </div>
        </div>
      )}
      {renderVideo()}
    </div>
  );
}
