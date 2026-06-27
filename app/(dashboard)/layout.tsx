import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            <main className="flex flex-col gap-8 py-8 p-2 lg:p-12 lg:px-28 w-full -ml-7"> 
                {/* ml - size of SidebarTrigger */}
                {children}
            </main>
        </SidebarProvider>
    )
}