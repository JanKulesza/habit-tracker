import { getEntriesForCurrentUser } from "@/lib/dal/entries";
import { getHabitsForCurrentUser } from "@/lib/dal/habits";
import { requireSession } from "@/lib/dal/session";

import HomePageClient from "@/components/pages/home";
import { startOfMonth } from "date-fns";

export default async function Home() {
  const { user } = await requireSession();
  const resHab = await getHabitsForCurrentUser();
  const resEntr = await getEntriesForCurrentUser({ start: startOfMonth(new Date) })
  if (!resHab.success || !resEntr.success)
    return console.log("Error while loading resources.");

  return <HomePageClient userName={user.name} entries={resEntr.data} habits={resHab.data} />
}
