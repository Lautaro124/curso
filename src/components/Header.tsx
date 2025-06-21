import Link from "next/link";
import { createSSRClient } from "@/lib/supabase/server";
import { isAdminValidation } from "@/lib/utils/user";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";

interface HeaderProps {
  currentSection: "dashboard" | "admin";
}

export default async function Header({ currentSection }: HeaderProps) {
  const supabase = await createSSRClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user ? await isAdminValidation(user.id) : false;
  const userName = user?.user_metadata?.full_name || "Usuario";

  const sectionTitle =
    currentSection === "admin"
      ? "Panel de Administración"
      : "Dashboard del Estudiante";
  const alternativeSectionTitle =
    currentSection === "admin" ? "Ver como Estudiante" : "Panel de Admin";
  const alternativeSectionPath =
    currentSection === "admin" ? "/dashboard" : "/admin/users";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {sectionTitle}
              </h1>
              <p className="text-xs text-gray-500">Bienvenido, {userName}</p>
            </div>

            <Navigation currentSection={currentSection} />
          </div>

          <div className="flex items-center space-x-4">
            {/* Cambiar de sección si es admin */}
            {isAdmin && (
              <Link
                href={alternativeSectionPath}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#7A7CFF] border border-gray-300 rounded-md hover:border-[#7A7CFF] transition-colors"
              >
                {alternativeSectionTitle}
              </Link>
            )}

            {/* Botón de cerrar sesión */}
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#7A7CFF] hover:bg-[#6A6CFF] transition-colors"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>

        <MobileNavigation currentSection={currentSection} />
      </div>
    </nav>
  );
}
