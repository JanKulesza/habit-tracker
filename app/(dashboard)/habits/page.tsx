import HabitsPageClient from "@/components/pages/habits";
import { getEntriesForCurrentUser } from "@/lib/dal/entries";
import { getHabitsForCurrentUser } from "@/lib/dal/habits";
import { toast } from "sonner";

export default async function HabitsPage() {
  const resHab = await getHabitsForCurrentUser();
  const resEntr = await getEntriesForCurrentUser()
  if (!resHab.success || !resEntr.success)
    return toast.error("Error while loading resources.");
  return <HabitsPageClient entries={resEntr.data} habits={resHab.data} />
}
