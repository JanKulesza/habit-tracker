"use client"
import { LogOutIcon } from 'lucide-react'
import { Button } from './ui/button'
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function SignOutBtn({ className }: { className?: string }) {
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); 
        },
      },
    });
  }

  return (
    <Button className={className} variant="destructive" onClick={handleSignOut}>
      <LogOutIcon />
    </Button>
  )
}
