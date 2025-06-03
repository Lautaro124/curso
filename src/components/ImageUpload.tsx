"use client";

import React, { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  name: string;
  label: string;
  currentImage?: string;
  className?: string;
  required?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  name,
  label,
  currentImage,
  className = "",
  required = false,
}) => {
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("url");
  const [imageUrl, setImageUrl] = useState(currentImage || "");
  const [previewUrl, setPreviewUrl] = useState(currentImage || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Solo se permiten archivos PNG, JPG o JPEG");
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError("El archivo no puede ser mayor a 5MB");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Generar nombre único para el archivo
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `course-images/${fileName}`;

      // Intentar subir archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (error) {
        // Si hay error con Storage, mostrar mensaje pero permitir continuar
        console.warn("Storage no configurado:", error);
        setUploadError("Storage no configurado. Por favor, usa URL por ahora.");
        setUploadMethod("url");
        return;
      }

      // Obtener URL pública del archivo
      const { data: publicData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      const publicUrl = publicData.publicUrl;
      setImageUrl(publicUrl);
      setPreviewUrl(publicUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError("Error al subir archivo. Usa URL por ahora.");
      setUploadMethod("url");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setImageUrl(url);
    setPreviewUrl(url);
    setUploadError(null);
  };

  const clearImage = () => {
    setImageUrl("");
    setPreviewUrl("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Selector del método de carga */}
      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="url"
            checked={uploadMethod === "url"}
            onChange={(e) => setUploadMethod(e.target.value as "url")}
            className="mr-2"
          />
          URL de imagen
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="file"
            checked={uploadMethod === "file"}
            onChange={(e) => setUploadMethod(e.target.value as "file")}
            className="mr-2"
          />
          Subir archivo
        </label>
      </div>

      {/* Input según el método seleccionado */}
      {uploadMethod === "url" ? (
        <input
          type="url"
          value={imageUrl}
          onChange={handleUrlChange}
          placeholder="https://ejemplo.com/imagen.jpg"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm px-3 py-2 border"
          required={required}
        />
      ) : (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#7A7CFF] file:text-white hover:file:bg-[#6A6CFF]"
            required={required && !imageUrl}
            disabled={isUploading}
          />
          <p className="text-xs text-gray-500">
            Formatos soportados: PNG, JPG, JPEG. Tamaño máximo: 5MB
          </p>
          <p className="text-xs text-orange-600">
            Nota: Para usar subida de archivos, configura primero Supabase
            Storage ejecutando el script setup_storage.sql
          </p>
        </div>
      )}

      {/* Estado de carga */}
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
          Subiendo imagen...
        </div>
      )}

      {/* Error */}
      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

      {/* Vista previa */}
      {previewUrl && !isUploading && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Vista previa
          </label>
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Vista previa"
              className="h-32 w-32 object-cover rounded-lg border border-gray-200"
              onError={() => {
                setPreviewUrl("");
                setUploadError(
                  "Error al cargar la imagen. Verifica que la URL sea válida."
                );
              }}
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs hover:bg-red-600"
              title="Eliminar imagen"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Input oculto para enviar la URL final */}
      <input type="hidden" name={name} value={imageUrl} />
    </div>
  );
};

export default ImageUpload;
