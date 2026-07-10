import AppSidebar from "@/components/app-sidebar";
import HabitStoreStateLoader from "@/components/habit-store-state-loader";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getEntriesForCurrentUser } from "@/lib/dal/entries";
import { getHabitsForCurrentUser } from "@/lib/dal/habits";
import { requireSession } from "@/lib/dal/session";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    await requireSession();
    const resHab = await getHabitsForCurrentUser();
    const resEntr = await getEntriesForCurrentUser();

     if (!resHab.success || !resEntr.success)
        throw new Error("Error while loading resources.");

    return (
        <>
            <HabitStoreStateLoader entries={resEntr.data ?? []} habits={resHab.data ?? []} />
            <SidebarProvider>
                <AppSidebar />
                <SidebarTrigger className="z-10" />
                <main className="flex flex-col gap-8 py-8 p-2 lg:p-12 w-full -ml-7">
                    {/* ml - size of SidebarTrigger */}
                    {children}
                </main>
            </SidebarProvider>
        </>

    )
}