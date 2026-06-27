import AddHabitBtn from "@/components/add-habit-btn";
import { ProgressU } from "@/components/ui/progress-updated";
import { getEntriesForCurrentUser } from "@/lib/dal/entries";
import { getHabitsForCurrentUser } from "@/lib/dal/habits";
import { requireSession } from "@/lib/dal/session";
import { formatEntriesByDate } from "@/lib/utils";
import { format, startOfMonth, startOfWeek } from "date-fns";
import { pl } from "date-fns/locale";
import { Flame, Medal, Target, TrendingUp } from "lucide-react";
import { sort } from "fast-sort";
import InfoBox from "@/components/info-box";

export default async function Home() {
  const { user } = await requireSession();
  const resHab = await getHabitsForCurrentUser();
  const resEntr = await getEntriesForCurrentUser({ start: startOfMonth(new Date) })
  if (!resHab.success || !resEntr.success)
    return console.log("Error while loading resources.");

  const entriesThisMo = formatEntriesByDate(resEntr.data),
    habits = resHab.data,
    entriesToday = entriesThisMo[format(new Date, "yyyy-MM-dd")],
    entriesThisWeek = formatEntriesByDate(resEntr.data, format(startOfWeek(new Date), "yyyy-MM-dd"));
  const progress = habits?.length ? (entriesToday?.length ?? 0 / habits.length) : 0
  const infoBoxes = [
    {
      title: "Today",
      icon: Target,
      iconColor: "text-[#6ec58e]",
      text: `${progress}%`,
      description: `${entriesToday?.length ?? "0"} out of ${habits?.length ?? 0} habits`
    },
    {
      title: "Active streaks",
      icon: Flame,
      iconColor: "text-[#fa914a]",
      text: `${entriesToday?.filter(val => val.streak > 0).length ?? 0}`,
      description: "running streaks",
    },
    {
      title: "Best streak",
      icon: Medal,
      iconColor: "text-[#a176f1]",
      text: `${sort(entriesToday).desc(e => e.streak)?.[0].streak ?? 0} days`,
      description: `All-time record`
    },
    {
      title: "This week",
      icon: TrendingUp,
      iconColor: "text-[#4cbaed]",
      text: `${(() => {
        let sum = 0, sumOfHabits = 0;
        for (const key in entriesThisWeek) {
          sum += entriesThisWeek[key].length ?? 0;
          sumOfHabits += habits?.length ?? 0
        }
        return sumOfHabits > 0 ? sum / sumOfHabits : 0
      })()
        }%`,
      description: "Average completion"
    },

  ]
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium">Hi, {user.name} 👋</h1>
          <p className="text-sm text-muted-foreground">{format(new Date(), "eeee, d MMMM", { locale: pl })} · TO DO: show how many habits left today</p>
        </div>
        <AddHabitBtn />
      </div>
      <div className="w-full space-y-4 border rounded-lg p-6">
        <p className="flex justify-between">
          <span className="font-medium">Progress for today</span>
          <span className="text-muted-foreground">{entriesToday?.length ? entriesToday.length : "0"}/{habits?.length ? habits.length : "0"} completed</span>
        </p>
        <ProgressU value={progress} max={100} />
        <p className="text-sm text-muted-foreground">
          {progress}% of the day is behind you - keep it up!
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 w-full">
        {infoBoxes.map((val, i) =>
          <InfoBox
            key={i}
            Icon={val.icon}
            description={val.description}
            text={val.text}
            title={val.title}
            iconColor={val.iconColor}
          />
        )}
      </div>
    </>
  );
}
