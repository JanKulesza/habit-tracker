import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { requireSession } from "@/lib/dal/session";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    await requireSession();
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger className="z-10" />
            <main className="flex flex-col gap-8 py-8 p-2 lg:p-12 w-full -ml-7"> 
                {/* ml - size of SidebarTrigger */}
                {children}
            </main>
        </SidebarProvider>
    )
}