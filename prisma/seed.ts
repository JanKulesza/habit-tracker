import { prisma } from "@/lib/prisma";
import { format, isBefore, startOfDay, subDays } from "date-fns";

const randomPastDate = (maxDaysAgo: number) =>
    subDays(new Date(), Math.floor(Math.random() * maxDaysAgo));

async function main() {
    const user = await prisma.user.findUniqueOrThrow({
        where: { email: process.env.PRISMA_SEED_EMAIL },
    });
    const habits = await Promise.all([
        prisma.habit.create({
            data: {
                icon: "💧",
                name: "Pij wodę",
                goal: "Wypij 2 litry dziennie",
                userId: user.id,
                createdAt: randomPastDate(30)
            }
        }),
        prisma.habit.create({
            data: {
                icon: "📚",
                name: "Czytanie 20 min",
                goal: "Przeczytaj 12 książek w roku",
                userId: user.id,
                createdAt: randomPastDate(30)
            }
        }),
        prisma.habit.create({
            data: {
                icon: "💪",
                name: "Trening",
                goal: "Ćwicz 3 razy w tygodniu",
                userId: user.id,
                createdAt: randomPastDate(30)
            }
        }),
        prisma.habit.create({
            data: {
                icon: "🧘",
                name: "Medytacja",
                goal: "10 minut dziennie",
                userId: user.id,
                createdAt: randomPastDate(30)
            }
        }),
        prisma.habit.create({
            data: {
                icon: "🧠",
                name: "Nauka języka",
                goal: "30 minut Duolingo dziennie",
                userId: user.id,
                createdAt: randomPastDate(30)
            }
        }),
        prisma.habit.create({
            data: {
                icon: "😴",
                name: "Sen",
                goal: "Kładź się spać przed 23:00",
                userId: user.id,
                createdAt: randomPastDate(30)
            }
        }),
    ]);

    const today = new Date();
    for (let i = 0; i < 30; i++) {
        const date = format(subDays(today, i), "yyyy-MM-dd");

        for (const habit of habits) {
            if (!isBefore(date, startOfDay(habit.createdAt)))
                if (Math.random() > 0.25) {
                    await prisma.entry.upsert({
                        where: { habitId_date: { habitId: habit.id, date } },
                        create: { habitId: habit.id, date },
                        update: {}
                    });
                }
        }
    }

    console.log("✅ Seed completed");
}
main()
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    }).finally(async () => {
        await prisma.$disconnect();
    });