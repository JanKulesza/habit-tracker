import ProfileCard from "@/components/profile-card";
import { User } from "@/generated/prisma/client";
import { requireSession } from "@/lib/dal/session";

export default async function SettingsPage() {
  const { user } = await requireSession();

  return (
    <div className="flex flex-col gap-8 w-full lg:max-w-150">
      <div>
        <h1 className="text-2xl font-medium">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>
      <ProfileCard user={user as User} />
    </div>
  )
}