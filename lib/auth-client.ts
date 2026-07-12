import { createAuthClient } from "better-auth/react"
import { toast } from "sonner";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.NEXT_PUBLIC_DOMAIN_NAME
})

// TO DO: Implement Sentry instead of console.error()
export const googleSignIn = async () => {
  const { error } = await authClient.signIn.social({
    provider: "google",
    callbackURL: `/`,
  });

  if (error) {
    console.error("BETTER AUTH REGISTER ERROR: ", error);
    toast.error(error.message ?? "Internal server error.");
    return
  }
};
