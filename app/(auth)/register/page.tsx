import { SeparatorText } from "@/components/ui/separator-text";
import GoogleSign from "@/components/buttons/google-sign";
import RegisterForm from "./form";
import Link from "next/link";
export default function RegisterPage() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-2">
      <div className="flex flex-col gap-6 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
        <div className="text-left">
          <h1 className="text-xl">Register account</h1>
          <p className="text-muted-foreground text-sm">Start building your habits today - for free.</p>
        </div>
        <div className="flex flex-col gap-2">
        <GoogleSign className="p-5" />
        <p className="text-muted-foreground text-sm">By registering with Google, you agree to our <Link href="/terms" className="text-primary underline cursor-pointer">Terms of Service</Link>.</p>
        </div>
        <SeparatorText text="or" />
        <RegisterForm />
      </div>
    </main>
  )
}
