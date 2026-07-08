"use client"

import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { deleteUser } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const DeleteAccountBtn = ({children} : {children: React.ReactNode}) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter()

    const handleDelete = async () => {
        setIsPending(true);
            
        try {
            await deleteUser();
            router.push('/login')
        } catch (error) {
            toast.error("Network error. Please check your connection and try again.");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="font-normal px-4 py-2">{children}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all of its data
                        from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleDelete}>{isPending ? <Spinner /> : "Delete account"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteAccountBtn