"use client"

import { Button, buttonVariants } from '../ui/button'
import { signOut } from '@/lib/auth-client';
import { VariantProps } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';

interface SignOutBtnProps {
  children: React.ReactNode
  className?: string
}

export default function SignOutBtn({ className, children, variant = "destructive" }: SignOutBtnProps & VariantProps<typeof buttonVariants>) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const handleSignOut = async () => {
    setIsPending(true);

    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button className={className} variant={variant} onClick={handleSignOut}>
      {isPending ? <Spinner /> : children}
    </Button>
  )
}
