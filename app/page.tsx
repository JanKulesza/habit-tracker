import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import Link from "next/link"

const LandingPage = () => {
    return (
        <>
            <nav className="flex justify-between p-8 items-center">
                <div className="flex gap-4 items-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary shrink-0">
                        <Zap className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-xl font-semibold 
                transition-all duration-300 ease-in-out 
                group-data-[state=collapsed]:w-0 group-data-[state=collapsed]:opacity-0 
                group-data-[state=expanded]:w-auto group-data-[state=expanded]:opacity-100 ">
                        Streak
                    </h1>
                </div>
                <div className="flex gap-10 items-center">
                    <Link href="/#howItWorks">How it works</Link>
                    <Link href="/#benefits">Benefits</Link>
                    <Link href="/#tesimonials">Testimonials</Link>
                </div>
                <div className="flex gap-4 items-center">
                    <Button asChild variant="ghost" className="px-8 py-5">
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild className="px-8 py-5">
                        <Link href="/register">Register</Link>
                    </Button>
                </div>
            </nav>
        </>
    )
}

export default LandingPage