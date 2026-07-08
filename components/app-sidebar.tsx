import { ChartColumn, Home, ListTodo, LogOutIcon, Settings, Zap } from "lucide-react";
import { SidebarHeader, SidebarContent, SidebarFooter, Sidebar } from "./ui/sidebar";
import AppSidebarBtn from "./buttons/app-sidebar-btn";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SignOutBtn from "./buttons/sign-out-btn";
import { TooltipTrigger, TooltipContent, Tooltip } from "./ui/tooltip";
import { requireSession } from "@/lib/dal/session";

// group-data-state is used to automatically detect parent's (Sidebar) collapse state and improve UX
export default async function AppSidebar() {
    const { user } = await requireSession();
    return (
        <Sidebar collapsible="icon" className="h-screen">
            <SidebarHeader className="flex-row justify-start items-center my-4 p-1.5
            transition-all duration-300 ease-in-out
            group-data-[state=expanded]:mx-2
            group-data-[state=expanded]:p-2">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary shrink-0">
                    <Zap className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold 
                transition-all duration-300 ease-in-out 
                group-data-[state=collapsed]:w-0 group-data-[state=collapsed]:opacity-0 
                group-data-[state=expanded]:w-auto group-data-[state=expanded]:opacity-100 ">
                    Streak
                </h2>
            </SidebarHeader>
            <SidebarContent className="transition-all duration-300 ease-in-out p-1 space-y-2
            group-data-[state=expanded]:mx-2 group-data-[state=expanded]:p-2">
                <AppSidebarBtn href="/" >
                    <Home className="h-4.5! w-4.5!" />
                    <span className="transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap data-[state=collapsed]:w-0 data-[state=collapsed]:opacity-0 data-[state=expanded]:w-auto">
                        Home
                    </span>
                </AppSidebarBtn>
                <AppSidebarBtn href="/habits" >
                    <ListTodo />
                    <span className="transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap data-[state=collapsed]:w-0 data-[state=collapsed]:opacity-0 data-[state=expanded]:w-auto">
                        Habits
                    </span>
                </AppSidebarBtn>
                <AppSidebarBtn href="/stats" >
                    <ChartColumn />
                    <span className="transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap data-[state=collapsed]:w-0 data-[state=collapsed]:opacity-0 data-[state=expanded]:w-auto">
                        Stats
                    </span>
                </AppSidebarBtn>
                <AppSidebarBtn href="/settings" >
                    <Settings />
                    <span className="transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap data-[state=collapsed]:w-0 data-[state=collapsed]:opacity-0 data-[state=expanded]:w-auto">
                        Settings
                    </span>
                </AppSidebarBtn>
            </SidebarContent>
            <SidebarFooter className="flex-row justify-between 
                transition-all duration-300 ease-in-out 
                p-1.5 gap-0 items-center h-20
                group-data-[state=expanded]:p-4">
                <div className="flex gap-2 items-center 
                transition-all duration-100 group-data-[state=expanded]:duration-500 ease-in-out 
                group-data-[state=collapsed]:w-0 group-data-[state=collapsed]:opacity-0 
                group-data-[state=expanded]:w-auto group-data-[state=expanded]:opacity-100">
                    <Avatar size="lg">
                        <AvatarImage
                            src="/"
                            alt="profile image"
                            className="grayscale"
                        />
                        <AvatarFallback>{user.name.slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="group-data-[state=collapsed]:hidden">
                                <p className="text-sm">
                                    {user.name.length > 20 ? user.name.slice(0, 20) + "..." : user.name}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {user.email.length > 20 ? user.email.slice(0, 20) + "..." : user.email}
                                </p>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="flex-col">
                            <p className="text-foreground text-sm">{user.name}</p>
                            <p className="text-muted-foreground text-xs">{user.email}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <SignOutBtn className="w-9 h-9 cursor-pointer z-10 transition-all duration-300 ease-in-out">
                    <LogOutIcon />
                </SignOutBtn>
            </SidebarFooter>
        </Sidebar>
    )
}
