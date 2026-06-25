import AddHabitBtn from "@/components/add-habit-btn";
import { requireSession } from "@/lib/dal/session";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

export default async function Home() {
  const {user} = await requireSession();
  return (
    <>
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
      <div>
        <h1 className="text-2xl font-medium">Hi, {user.name} 👋</h1>
        <p className="text-sm text-muted-foreground">{format(new Date(), "eeee, d MMMM", { locale: pl })} · TO DO: show how many habits left today</p>
      </div>
       <AddHabitBtn />
    </div>
    </>
  );
}
