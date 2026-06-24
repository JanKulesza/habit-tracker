import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ["/", "/stats", "/settings", "/habits"];
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const isRouteProtected = protectedRoutes.includes(request.nextUrl.pathname);

    if (isRouteProtected && !sessionCookie)
        return NextResponse.redirect(new URL("/login", request.url));

    if (!isRouteProtected && sessionCookie)
        return NextResponse.redirect(new URL("/", request.url));
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Exclude API routes, static files, image optimizations, and .png files
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    ],
}