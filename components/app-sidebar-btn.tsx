import { LucideProps } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import { FC } from 'react'

interface AppSidebarBtnProps {
    text: string,
    href: string,
    icon: FC<LucideProps>
}

export default function AppSidebarBtn({text,href,icon: Icon}: AppSidebarBtnProps) {
    return (
        <Button asChild variant="ghost" className="text-muted-foreground justify-start items-center gap-4 h-10 font-normal">
            <Link href={href} className="">
                <Icon className="h-[18px]! w-[18px]!" />
                <span className="transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap data-[state=collapsed]:w-0 data-[state=collapsed]:opacity-0 data-[state=expanded]:w-auto">
                    {text}
                </span>
            </Link>
        </Button>
    )
}
