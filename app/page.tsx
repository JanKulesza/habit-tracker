import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth";
import { ArrowRight, ChartColumn, Check, DoorOpen, Star, Zap } from "lucide-react"
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link"
import dashboardImg from "@/public/dashboard.png";
import statsImg from "@/public/stats.png";
import habitDetailImg from "@/public/habit-detail.png";
import { AvatarGroup, AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import SignOutBtn from "@/components/buttons/sign-out-btn";

const LandingPage = async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    return (
        <main className="space-y-8">
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
                {!session
                    ? <div className="flex gap-4 items-center">
                        <Button asChild variant="ghost" className="px-8 py-5">
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild className="px-8 py-5">
                            <Link href="/register">Register</Link>
                        </Button>
                    </div>
                    : <div className="flex gap-4 items-center">
                        <Button asChild className="px-8 py-5">
                            <Link href="/dashboard"><ChartColumn /> Your Dashboard  </Link>
                        </Button>
                        <SignOutBtn className="p-5">
                                <DoorOpen />
                        </SignOutBtn>
                    </div>
                }
            </nav>
            <div className="flex gap-10 p-8 items-center">
                <div className="w-2/5 space-y-6">
                    <div className="border border-primary rounded-xl p-1 px-4 text-xs flex gap-3 items-center w-fit"><Star className="text-primary size-4" fill="var(--primary)" /> Build better habits. Every day.</div>
                    <h2 className="text-6xl font-bold">Small habits. <br /> <span className="text-primary">Big changes.</span></h2>
                    <p className="text-muted-foreground">Streak helps you build good habits, break bad ones and stay consistent with what matters most.</p>
                    <ul className="list-none space-y-4 my-12 text-sm">
                        <li className="flex gap-3 items-center"><Check className="text-white bg-primary rounded-xl size-5 p-1" /> Build healthy routines effortlessly</li>
                        <li className="flex gap-3 items-center"><Check className="text-white bg-primary rounded-xl size-5 p-1" /> Stay motivated with streaks and reminders</li>
                        <li className="flex gap-3 items-center"><Check className="text-white bg-primary rounded-xl size-5 p-1" /> Track your progress with beautiful analytics</li>
                        <li className="flex gap-3 items-center"><Check className="text-white bg-primary rounded-xl size-5 p-1" /> Become the best version of yourself</li>
                    </ul>
                    {!session
                        ? <div className="flex gap-4 items-center">
                            <Button asChild className="px-8 py-5">
                                <Link href="/register" className="flex gap-2">Get Started Free <ArrowRight /></Link>
                            </Button>
                            <p className="text-muted-foreground text-xs">No credit card required • Free forever</p>
                        </div>
                        : <Button asChild className="px-8 py-5">
                            <Link href="/dashboard"><ChartColumn /> Your Dashboard  </Link>
                        </Button>
                    }
                    <div className="flex gap-6 items-center">
                        <AvatarGroup>
                            <Avatar>
                                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80" alt="Portrait of a smiling woman" />
                                <AvatarFallback>AW</AvatarFallback>
                            </Avatar>
                            <Avatar>
                                <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" alt="Portrait of a man in a jacket" />
                                <AvatarFallback>JM</AvatarFallback>
                            </Avatar>
                            <Avatar>
                                <AvatarImage
                                    src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80"
                                    alt="Portrait of a smiling woman with glasses"
                                />
                                <AvatarFallback>EL</AvatarFallback>
                            </Avatar>
                            <Avatar>
                                <AvatarImage
                                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"
                                    alt="Portrait of a man smiling outdoors"
                                />
                                <AvatarFallback>DB</AvatarFallback>
                            </Avatar>
                        </AvatarGroup>
                        <div>
                            <div className="flex gap-2 mb-1">
                                {[1, 2, 3, 4, 5].map(val => <Star key={val} className="text-yellow-500 size-5" fill="var(--color-yellow-500)" />)}
                            </div>
                            <p className="text-muted-foreground text-sm">Trusted by 50,000+ habit builders worldwide.</p>
                        </div>
                    </div>
                </div>
                <div className="w-3/5 flex items-center justify-center">
                    <div className="relative w-full h-full">

                        <Image
                            src={dashboardImg}
                            alt="Dashboard"
                            className="
                              absolute
                              left-1/2
                              top-1/2
                              -translate-x-1/2
                              -translate-y-1/2
                              w-[720px]
                              rounded-3xl
                              border
                              shadow-2xl
                              z-20
                            "
                        />

                        <Image
                            src={habitDetailImg}
                            alt="Habits"
                            className="
                              absolute
                              top-30
                              left-6
                              w-[260px]
                              rounded-3xl
                              border
                              shadow-xl
                              z-30
                              rotate-[-8deg]
                            "
                        />

                        <Image
                            src={statsImg}
                            alt="Stats"
                            className="
                                absolute
                                bottom-30
                                right-6
                                w-[320px]
                                rounded-3xl
                                border
                                shadow-xl
                                z-30
                                rotate-[6deg]
                            "
                        />

                        {/* Glow */}
                        <div className="absolute inset-0 -z-10 flex items-center justify-center">
                            <div className="h-[420px] w-[420px] rounded-full bg-primary/20 blur-[120px]" />
                        </div>

                    </div>
                </div>
            </div>
        </main>
    )
}

export default LandingPage