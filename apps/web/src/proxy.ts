import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/sign-in", "/sign-up"];
const protectedRoutes = ["/blogs"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Redirect / based on auth state
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(token ? "/blogs" : "/sign-in", request.url)
    );
  }

  // Authenticated users have no business on auth pages
  if (token && publicRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/blogs", request.url));
  }

  // Unauthenticated users cannot access protected pages
  if (!token && protectedRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico).*)"],
};
