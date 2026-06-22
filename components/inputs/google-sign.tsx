"use client"
import { googleSignIn } from '@/lib/auth-client';
import { Button } from '../ui/button'
import google from "@/public/google.svg";
import Image from "next/image";
import { cn } from '@/lib/utils';

export default function GoogleSign({className} : {className?: string}) {
    return (
        <Button variant="outline" className={cn("w-full", className)} onClick={googleSignIn}>
            <Image src={google} alt="Continue with Google" height={16} width={16} />
            Continue with Google
        </Button>
    )
}
