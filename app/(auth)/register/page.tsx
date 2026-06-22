import { SeparatorText } from "@/components/ui/separator-text";
import GoogleSign from "@/components/inputs/google-sign";
import RegisterForm from "./form";
export default function RegisterPage() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-2">
      <div className="flex flex-col gap-6 w-full sm:w-1/2 lg:w-1/3">
        <div className="text-left">
          <h1 className="text-xl">Register account</h1>
          <p className="text-muted-foreground text-sm">Start building your habits today - for free.</p>
        </div>
        <GoogleSign className="p-5" />
        <SeparatorText text="or" />
        <RegisterForm />
      </div>
    </main>
  )
}
