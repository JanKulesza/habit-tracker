import { SeparatorText } from "@/components/ui/separator-text";
import GoogleSign from "@/components/inputs/google-sign";
import LoginForm from "./form";
export default function LoginPage() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-2">
      <div className="flex flex-col gap-6 w-full sm:w-1/2 lg:w-1/3">
        <div className="text-left">
          <h1 className="text-xl">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Please login to continue your streak</p>
        </div>
        <GoogleSign className="p-5" />
        <SeparatorText text="or" />
        <LoginForm />
      </div>
    </main>
  )
}
