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
                name: "Drink water",
                goal: "Drink 2 liters per day",
                userId: user.id,
                createdAt: randomPastDate(30)
            }
        }),
        prisma.habit.create({
            data: {
                icon: "📚",
                name: "Read 20 min",
                goal: "Read 12 books this year",
                userId: user.id,
                createdAt: randomPastDate(30)
            }
        }),
        prisma.habit.create({
            data: {
                icon: "💪",
                name: "Workout",
                goal: "Exercise 3 times per week",
                userId: user.id,
                createdAt: randomPastDate(30)
            }
        }),
        prisma.habit.create({
            data: {
                icon: "🧘",
                name: "Meditation",
                goal: "10 minutes every day",
                userId: user.id,
                createdAt: randomPastDate(30)
            }
        }),
        prisma.habit.create({
            data: {
                icon: "🧠",
                name: "Language learning",
                goal: "30 minutes of Duolingo every day",
                userId: user.id,
                createdAt: randomPastDate(30)
            }
        }),
        prisma.habit.create({
            data: {
                icon: "😴",
                name: "Sleep",
                goal: "Go to bed before 23:00",
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