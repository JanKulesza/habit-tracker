import HabitDetailsClientPage from "@/components/pages/habit-details";
import { Button } from "@/components/ui/button";
import { getEntriesForCurrentUser } from "@/lib/dal/entries";
import { getHabit } from "@/lib/dal/habits";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function HabitsIdPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  const resHab = await getHabit(Number(id));
  const resEntr = await getEntriesForCurrentUser(Number(id));
  if (!resHab.success || !resEntr.success)
    return 
  return (
    <>
      <Button asChild variant={"ghost"} className="w-fit">
        <Link href="/habits"><ChevronLeft />All habits</Link>
      </Button>
      <HabitDetailsClientPage habit={resHab.data} habitEntries={resEntr.data} />
    </>
  )
}
