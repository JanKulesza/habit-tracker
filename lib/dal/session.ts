import 'server-only'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from 'react';

export async function getSession() {
    return auth.api.getSession({ headers: await headers() });
}

export const requireSession = cache(async () => {
    const session = await getSession();
    if (!session) redirect("/login");
    return session;
});