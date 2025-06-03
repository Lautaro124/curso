"use client";

import React, { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface AttachmentFile {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

interface FileUploadProps {
  name: string;
  label: string;
  currentFiles?: AttachmentFile[];
  className?: string;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  label,
  currentFiles = [],
  className = "",
  required = false,
}) => {
  const [files, setFiles] = useState<AttachmentFile[]>(currentFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        // Validar tamaño (máximo 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          throw new Error(
            `El archivo ${file.name} es demasiado grande (máximo 10MB)`
          );
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const filePath = `attachments/${fileName}`;

        const { error } = await supabase.storage
          .from("files") // Usar bucket diferente para archivos
          .upload(filePath, file);

        if (error) {
          throw new Error(`Error al subir ${file.name}: ${error.message}`);
        }

        // Obtener URL pública del archivo
        const { data: publicData } = supabase.storage
          .from("files")
          .getPublicUrl(filePath);

        return {
          name: file.name,
          url: publicData.publicUrl,
          size: file.size,
          type: file.type,
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadError(
        error instanceof Error ? error.message : "Error al subir archivos"
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "ppt":
      case "pptx":
        return "📑";
      case "zip":
      case "rar":
        return "🗜️";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "🖼️";
      case "mp4":
      case "avi":
      case "mov":
        return "🎥";
      case "mp3":
      case "wav":
        return "🎵";
      default:
        return "📎";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Subir archivos */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Subir archivos
        </label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#7A7CFF] file:text-white hover:file:bg-[#6A6CFF]"
          disabled={isUploading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Tamaño máximo por archivo: 10MB
        </p>
      </div>

      {isUploading && (
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="animate-spin -ml-1 mr-3 h-4 w-4 text-[#7A7CFF]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Subiendo archivos...
        </div>
      )}

      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

      {/* Lista de archivos */}
      {files.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Archivos adjuntos ({files.length})
          </label>
          <div className="border rounded-md p-3 bg-gray-50 max-h-48 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-3 bg-white rounded-md border border-gray-200 mb-2 last:mb-0"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className="text-lg">{getFileIcon(file.name)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    {file.size && (
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7A7CFF] hover:text-[#6A6CFF] text-sm"
                  >
                    Ver
                  </a>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="Eliminar archivo"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input oculto para enviar los archivos como JSON */}
      <input type="hidden" name={name} value={JSON.stringify(files)} />
    </div>
  );
};

export default FileUpload;
