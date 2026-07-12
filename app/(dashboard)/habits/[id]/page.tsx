import HabitDetailsClientPage from "@/components/pages/habit-details";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function HabitsIdPage({ params }: {
  params: Promise<{
    id: string
  }>
}) {
  const id = Number((await params).id)
  return (
    <>
      <Button asChild variant={"ghost"} className="w-fit">
        <Link href="/habits"><ChevronLeft />All habits</Link>
      </Button>
      <HabitDetailsClientPage id={id} />
    </>
  )
}
