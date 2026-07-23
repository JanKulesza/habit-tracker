import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = [
    /^\/dashboard(?:\/.*)?$/
];
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const isRouteProtected = protectedRoutes.some(regex => regex.test(request.nextUrl.pathname))

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