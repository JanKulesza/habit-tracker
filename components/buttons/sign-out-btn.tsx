"use client"

import { Button, buttonVariants } from '../ui/button'
import { VariantProps } from 'class-variance-authority';
import { Spinner } from '../ui/spinner';
import { useAuth } from '@/hooks/use-auth';

interface SignOutBtnProps {
  children: React.ReactNode
  className?: string
}

export default function SignOutBtn({ className, children, variant = "destructive" }: SignOutBtnProps & VariantProps<typeof buttonVariants>) {
  const { isPending, signOut } = useAuth()

  return (
    <Button className={className} variant={variant} onClick={signOut}>
      {isPending ? <Spinner /> : children}
    </Button>
  )
}
