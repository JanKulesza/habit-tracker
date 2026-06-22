"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Separator } from "./separator"

function SeparatorText({
    text,
    className,
    ...props
}: { text: string } & React.ComponentProps<"div">) {
    return (
        <div className={cn("flex items-center", className)} {...props}>
            <Separator className="flex-1" />
            <span className="mx-4 text-xs text-muted-foreground">
                {text}
            </span>
            <Separator className="flex-1" />
        </div>
    )
}

export { SeparatorText }
