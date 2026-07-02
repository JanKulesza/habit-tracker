import 'server-only'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from 'react';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { isAPIError } from 'better-auth/api';

export const requireSession = cache(async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session)
        redirect("/login");
    return session;
});