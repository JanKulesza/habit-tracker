"use client"
import { LogOutIcon } from 'lucide-react'
import { Button } from './ui/button'
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SignOutBtn({ className }: { className?: string }) {
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); 
          toast.success("Signed out successfully.")
        },
        onError(context) {
          toast.error(context.error.message)
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
