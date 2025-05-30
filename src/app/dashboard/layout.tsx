import { createSSRClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSSRClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#7A7CFF] hover:bg-[#6A6CFF] transition-colors"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}
