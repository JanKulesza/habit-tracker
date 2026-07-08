import { createAuthClient } from "better-auth/react"
import { toast } from "sonner";
import { LoginSchema, RegisterSchema } from "./validations";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:3000"
})

// TO DO: Implement Sentry instead of console.error()

export const googleSignIn = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
    fetchOptions: {
      onError: (context) => {
        console.error("BETTER AUTH GOOGLE ERROR: ", context.error);
        toast.error(context.error.message ?? "Internal server error.");
      },
    }
  });
};

export const credentialsRegister = async (values: RegisterSchema) => {
  const { error } = await authClient.signUp.email({
    ...values,
    callbackURL: `/`
  });

  if (error) {
    console.error("BETTER AUTH REGISTER ERROR: ", error);
    return toast.error(error.message ?? "Internal server error.");
  }

  toast.success("Registered successfully.");
};

export const credentialsLogin = async (values: LoginSchema) => {
  const { error } = await authClient.signIn.email({
    ...values,
    callbackURL: "/"
  });

  if (error) {
    console.error("BETTER AUTH LOGIN ERROR: ", error);
    return toast.error(error.message ?? "Internal server error.");
  }

  toast.success("Logged in successfully.");
};

export const signOut = async () => {
  const { error } = await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        toast.success("Signed out successfully.")
      },
    },
  });

  if (error) {
    toast.error(error.message ?? "Internal server error.")
    return;
  }
}

export const deleteUser = async () => {
  const { error } = await authClient.deleteUser();

  if (error) {
    toast.error(error.message ?? "Internal server error.")
    return;
  }

  toast.success("Account deleted successfully.")
}

