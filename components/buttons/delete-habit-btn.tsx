"use client"

import { Habit } from "@/generated/prisma/client"
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
import { useTransition } from "react"
import { deleteHabit } from "@/lib/dal/habits"
import { toast } from "sonner"
import { Spinner } from "../ui/spinner"
import { isRedirectError } from "next/dist/client/components/redirect-error"

interface DeleteHabitBtnProps {
    habitId: Habit['id'],
    children: React.ReactNode
}

export default function DeleteHabitBtn({ habitId, children }: DeleteHabitBtnProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => startTransition(async () => {
        try {
            const res = await deleteHabit(habitId);

            if (!res?.success) {
                toast.error(res.error);
                return
            }
            toast.success("Deleted habit successfully.")
        } catch (error) {
            if (isRedirectError(error))
                throw error;
            toast.error("Network error. Please check your connection and try again.");
        }
    })

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
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
                    <AlertDialogAction
                        variant="destructive"
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete()
                        }}
                    >
                        {isPending ? <Spinner /> : "Continue"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
