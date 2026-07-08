"use client"

import { Button } from '../ui/button'
import Link from 'next/link'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

interface AppSidebarBtnProps {
    href: string,
    children: ReactNode
}

export default function AppSidebarBtn({ href, children }: AppSidebarBtnProps) {
    const pathname = usePathname();
    
    return (
        <Button asChild variant="ghost" className={cn(
            "text-muted-foreground justify-start items-center gap-4 h-10 font-normal", 
            pathname === href && "bg-muted text-foreground"
        )}>
            <Link href={href}>
                {children}
            </Link>
        </Button>
    )
}
