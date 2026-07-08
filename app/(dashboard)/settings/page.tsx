import ProfileCard from "@/app/(dashboard)/settings/card-profile";
import { User } from "@/generated/prisma/client";
import { requireSession } from "@/lib/dal/session";
import AppearanceCard from "./card-appearance";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SignOutBtn from "@/components/buttons/sign-out-btn";
import { LogOutIcon } from "lucide-react";

export default async function SettingsPage() {
  const { user } = await requireSession();

  return (
    <div className="flex flex-col gap-8 w-full lg:max-w-150">
      <div>
        <h1 className="text-2xl font-medium">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>
      <ProfileCard user={user as User} />
      <AppearanceCard />
      <Card className='py-5 ring-destructive/20'>
        <CardHeader className="font-medium text-lg text-destructive">
          Danger zone
        </CardHeader>
        <CardContent className="space-y-2">
          <div className='flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center'>
            <div>
              <h2 className="font-medium text-sm mb-1">Sign out</h2>
              <p className="text-muted-foreground text-xs mb-1">End the current session on this device</p>
            </div>
            <SignOutBtn className="px-6 py-4">
              <LogOutIcon /> Sign out
            </SignOutBtn>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}