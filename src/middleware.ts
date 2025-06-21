import { NextResponse, type NextRequest } from "next/server";
import { createSSRClient } from "./lib/supabase/server";
import { isAdminValidation } from "./lib/utils/user";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Agregar el pathname a los headers para acceso en el servidor
  response.headers.set("x-pathname", request.nextUrl.pathname);

  const supabase = await createSSRClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const isAdmin = await isAdminValidation(user.id);
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register")
  ) {
    const isAdmin = await isAdminValidation(user.id);
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin/users", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
