"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationProps {
  currentSection: "dashboard" | "admin";
}

export default function Navigation({ currentSection }: NavigationProps) {
  const pathname = usePathname();

  // Función para determinar el texto de la página actual
  const getPageTitle = (path: string) => {
    if (path.includes("/admin/users")) return "Gestión de Usuarios";
    if (path.includes("/admin/courses") && path.includes("/edit"))
      return "Editar Curso";
    if (path.includes("/admin/courses") && path.includes("/modules/new"))
      return "Nuevo Módulo";
    if (path.includes("/admin/courses")) return "Gestión de Cursos";
    if (path.includes("/admin/modules") && path.includes("/edit"))
      return "Editar Módulo";
    if (path.includes("/admin/modules") && path.includes("/lessons/new"))
      return "Nueva Lección";
    if (path.includes("/admin/lessons") && path.includes("/edit"))
      return "Editar Lección";
    if (path.includes("/dashboard/modulos")) return "Módulo";
    if (path.includes("/dashboard/lecciones")) return "Lección";
    if (path.includes("/dashboard")) return "Mis Cursos";
    return "";
  };

  // Función para verificar si un enlace está activo
  const isActiveLink = (path: string) => {
    if (path === "/admin/users" && pathname.includes("/admin/users"))
      return true;
    if (path === "/admin/courses" && pathname.includes("/admin/courses"))
      return true;
    if (path === "/dashboard" && pathname.includes("/dashboard")) return true;
    return false;
  };

  return (
    <div className="flex items-center space-x-8">
      {/* Navegación según la sección actual - Solo Desktop */}
      <div className="hidden md:flex items-center space-x-6">
        {currentSection === "admin" ? (
          <>
            <Link
              href="/admin/users"
              className={`transition-colors font-medium ${
                isActiveLink("/admin/users")
                  ? "text-[#7A7CFF] border-b-2 border-[#7A7CFF] pb-1"
                  : "text-gray-600 hover:text-[#7A7CFF]"
              }`}
            >
              Gestionar Usuarios
            </Link>
            <Link
              href="/admin/courses"
              className={`transition-colors font-medium ${
                isActiveLink("/admin/courses")
                  ? "text-[#7A7CFF] border-b-2 border-[#7A7CFF] pb-1"
                  : "text-gray-600 hover:text-[#7A7CFF]"
              }`}
            >
              Gestionar Cursos
            </Link>
          </>
        ) : (
          <Link
            href="/dashboard"
            className={`transition-colors font-medium ${
              isActiveLink("/dashboard")
                ? "text-[#7A7CFF] border-b-2 border-[#7A7CFF] pb-1"
                : "text-gray-600 hover:text-[#7A7CFF]"
            }`}
          >
            Mis Cursos
          </Link>
        )}
      </div>
    </div>
  );
}
