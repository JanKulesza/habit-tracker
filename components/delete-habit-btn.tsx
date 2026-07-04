"use client"

import { Habit } from "@/generated/prisma/client"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { deleteHabit } from "@/lib/dal/habits"
import { toast } from "sonner"
import { Spinner } from "./ui/spinner"
import { useRouter } from "next/navigation"

interface DeleteHabitBtnProps {
    habitId: Habit['id'],
}

export default function DeleteHabitBtn({ habitId }: DeleteHabitBtnProps) {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsPending(true);
            
        try {
            const res = await deleteHabit(habitId);

            if (!res?.success) 
                return toast.error(res.error);
            toast.success("Deleted habit successfully.")
            router.push("/habits");
        } catch (error) {
            toast.error("Network error. Please check your connection and try again.");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="font-normal p-5"><Trash2 /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the habit and remove all of its data
                        from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleDelete}>{isPending ? <Spinner /> : "Continue"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
