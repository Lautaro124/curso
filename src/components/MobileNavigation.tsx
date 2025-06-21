"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavigationProps {
  currentSection: "dashboard" | "admin";
}

export default function MobileNavigation({
  currentSection,
}: MobileNavigationProps) {
  const pathname = usePathname();

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
    <div className="md:hidden border-t border-gray-200 pt-4 pb-3">
      <div className="flex flex-col space-y-2">
        {currentSection === "admin" ? (
          <>
            <Link
              href="/admin/users"
              className={`transition-colors font-medium py-2 ${
                isActiveLink("/admin/users")
                  ? "text-[#7A7CFF] bg-[#7A7CFF]/10 px-3 rounded-md"
                  : "text-gray-600 hover:text-[#7A7CFF]"
              }`}
            >
              Gestionar Usuarios
            </Link>
            <Link
              href="/admin/courses"
              className={`transition-colors font-medium py-2 ${
                isActiveLink("/admin/courses")
                  ? "text-[#7A7CFF] bg-[#7A7CFF]/10 px-3 rounded-md"
                  : "text-gray-600 hover:text-[#7A7CFF]"
              }`}
            >
              Gestionar Cursos
            </Link>
          </>
        ) : (
          <Link
            href="/dashboard"
            className={`transition-colors font-medium py-2 ${
              isActiveLink("/dashboard")
                ? "text-[#7A7CFF] bg-[#7A7CFF]/10 px-3 rounded-md"
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
