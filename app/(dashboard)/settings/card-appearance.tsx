"use client"

import { useTheme } from 'next-themes'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'
import { Moon, Sun } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

const AppearanceCard = () => {
    const { setTheme, resolvedTheme } = useTheme()

    return (
        <Card className='py-5'>
            <CardHeader className="font-medium text-lg">
                Appearance
            </CardHeader>
            <CardContent className='flex gap-4 justify-between items-center'>
                <div className="flex gap-4 items-center">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <div>
                        <h2 className='text-sm'>Dark mode</h2>
                        <p className='text-muted-foreground text-xs'>Switch between dark and light mode</p>
                    </div>
                </div>
                <Switch
                    onCheckedChange={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    checked={resolvedTheme === "dark"}
                    className='cursor-pointer'
                />
            </CardContent>
        </Card>
    )
}

export default AppearanceCard