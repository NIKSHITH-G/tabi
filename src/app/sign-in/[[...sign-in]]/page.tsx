import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignInPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <SignIn
        appearance={clerkAppearance}
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/onboarding"
      />
    </div>
  );
}
