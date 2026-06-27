import AddHabitBtn from "@/components/add-habit-btn";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { ProgressU } from "@/components/ui/progress-updated";
import { getEntriesForCurrentUser } from "@/lib/dal/entries";
import { getHabitsForCurrentUser } from "@/lib/dal/habits";
import { requireSession } from "@/lib/dal/session";
import { formatEntriesByDate } from "@/lib/utils";
import { format, startOfMonth } from "date-fns";
import { pl } from "date-fns/locale";

export default async function Home() {
  const { user } = await requireSession();
  const resHab = await getHabitsForCurrentUser();
  const resEntr = await getEntriesForCurrentUser({ start: startOfMonth(new Date) })
  if (!resHab.success || !resEntr.success)
    return console.log("Error while loading resources.");

  const entriesThisMo = formatEntriesByDate(resEntr.data),
    habits = resHab.data,
    entriesToday = entriesThisMo[format(new Date, "yyyy-MM-dd")];
  const progress = habits?.length ? (entriesToday?.length ? entriesToday.length : 0 / habits.length) : 0
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium">Hi, {user.name} 👋</h1>
          <p className="text-sm text-muted-foreground">{format(new Date(), "eeee, d MMMM", { locale: pl })} · TO DO: show how many habits left today</p>
        </div>
        <AddHabitBtn />
      </div>
      <Field className="w-full gap-4 border rounded-lg p-6">
        <FieldLabel htmlFor="progress-today">
          <span className="font-medium">Progress for today</span>
          <span className="text-muted-foreground ml-auto">{entriesToday?.length ? entriesToday.length : "0"}/{habits?.length ? habits.length : "0"} completed</span>
        </FieldLabel>
        <ProgressU value={progress} max={100} id="progress-today" />
        <FieldDescription>
          {progress}% of the day is behind you - keep it up!
        </FieldDescription>
      </Field>
      
    </>
  );
}
