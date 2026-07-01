import { createAuthClient } from "better-auth/react"
import { toast } from "sonner";
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000"
})

export const googleSignIn = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
    fetchOptions: {
        onSuccess: () => {
          toast.success("Signed in successfully.")
        },
        onError(context) {
          toast.error(context.error.message)
        },
      }
  });
};