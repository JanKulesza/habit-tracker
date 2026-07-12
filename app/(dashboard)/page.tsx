import { requireSession } from "@/lib/dal/session";
import HomePageClient from "@/components/pages/home";

export default async function Home() {
  const { user } = await requireSession();

  return <HomePageClient userName={user.name} />
}
