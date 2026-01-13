import { NextResponse } from "next/server"

export function proxy(request) {
  const adminId = request.cookies.get("admin_id")?.value
  const path = request.nextUrl.pathname

  if (path.startsWith("/admin/dashboard") || path.startsWith("/admin/api")) {
    if (!adminId) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
