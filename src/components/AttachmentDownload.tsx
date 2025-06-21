"use client";

import { useState } from "react";

interface AttachmentFile {
  name: string;
  url: string;
  size?: number; // Optional file size in bytes
}

interface AttachmentDownloadProps {
  file: AttachmentFile;
}

export default function AttachmentDownload({ file }: AttachmentDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDownloading(true);

    try {
      // Create a temporary anchor element for download
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Fallback: open in new tab
      window.open(file.url, "_blank", "noopener,noreferrer");
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "";

    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  const getFileIcon = (extension: string) => {
    const iconClass = "w-5 h-5 flex-shrink-0";

    switch (extension) {
      case "pdf":
        return (
          <svg
            className={`${iconClass} text-red-600`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z" />
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
            <path d="M14,9V2.5L20.5,9H14z" />
          </svg>
        );
      case "doc":
      case "docx":
        return (
          <svg
            className={`${iconClass} text-blue-600`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
            <path d="M14,9V2.5L20.5,9H14z" />
          </svg>
        );
      case "xls":
      case "xlsx":
        return (
          <svg
            className={`${iconClass} text-green-600`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
            <path d="M14,9V2.5L20.5,9H14z" />
          </svg>
        );
      case "ppt":
      case "pptx":
        return (
          <svg
            className={`${iconClass} text-orange-600`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
            <path d="M14,9V2.5L20.5,9H14z" />
          </svg>
        );
      case "zip":
      case "rar":
      case "7z":
        return (
          <svg
            className={`${iconClass} text-purple-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
        return (
          <svg
            className={`${iconClass} text-pink-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className={`${iconClass} text-gray-600`}
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
        );
    }
  };

  const extension = getFileExtension(file.name);

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {getFileIcon(extension)}
        <div className="min-w-0 flex-1">
          <p
            className="text-sm font-medium text-gray-700 truncate"
            title={file.name}
          >
            {file.name}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="uppercase font-medium">
              {extension || "archivo"}
            </span>
            {file.size && (
              <>
                <span>•</span>
                <span>{formatFileSize(file.size)}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          isDownloading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-[#7A7CFF] text-white hover:bg-[#6B6DFF] group-hover:shadow-md"
        }`}
        title={`Descargar ${file.name}`}
      >
        {isDownloading ? (
          <svg
            className="w-3 h-3 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        ) : (
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}
        {isDownloading ? "Descargando..." : "Descargar"}
      </button>
    </div>
  );
}
