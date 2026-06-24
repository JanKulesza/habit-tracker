import { ChartColumn, Home, ListTodo, Settings, Zap } from "lucide-react";
import { SidebarHeader, SidebarContent, SidebarFooter, Sidebar } from "./ui/sidebar";
import AppSidebarBtn from "./app-sidebar-btn";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SignOutBtn from "./sign-out-btn";

// group-data-state is used to automatically detect parent's (Sidebar) collapse state and improve UX
export default function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="flex-row justify-start items-center my-4 p-1.5
            transition-all duration-300 ease-in-out
            group-data-[state=expanded]:mx-2
            group-data-[state=expanded]:p-2">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary shrink-0">
                    <Zap className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-lg font-semibold 
                transition-all duration-300 ease-in-out 
                group-data-[state=collapsed]:w-0 group-data-[state=collapsed]:opacity-0 
                group-data-[state=expanded]:w-auto group-data-[state=expanded]:opacity-100 ">
                    Streak
                </h1>
            </SidebarHeader>
            <SidebarContent className="transition-all duration-300 ease-in-out p-1
            group-data-[state=expanded]:mx-2 group-data-[state=expanded]:p-2">
                <AppSidebarBtn href="/" icon={Home} text="Home" />
                <AppSidebarBtn href="/habits" icon={ListTodo} text="Habits" />
                <AppSidebarBtn href="/stats" icon={ChartColumn} text="Stats" />
                <AppSidebarBtn href="/settings" icon={Settings} text="Settings" />
            </SidebarContent>
            <SidebarFooter className="flex-row justify-between 
                transition-all duration-300 ease-in-out 
                p-1.5 gap-0 items-center h-20
                group-data-[state=expanded]:p-4 group-data-[state=expanded]:gap-2">
                <div className="flex gap-2 items-center 
                transition-all duration-0 group-data-[state=expanded]:duration-500 ease-in-out 
                group-data-[state=collapsed]:w-0 group-data-[state=collapsed]:opacity-0 
                group-data-[state=expanded]:w-auto group-data-[state=expanded]:opacity-100">
                    <Avatar size="lg">
                    <AvatarImage
                        src="/"
                        alt="profile image"
                        className="grayscale"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm">Jan Kulesza</p>
                    <p className="text-muted-foreground text-xs">example@example.com</p>
                </div>
                </div>
                <SignOutBtn className="w-9 h-9 cursor-pointer z-10 transition-all duration-300 ease-in-out" />
            </SidebarFooter>
        </Sidebar>
    )
}
