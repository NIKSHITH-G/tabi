import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignUpPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <SignUp
        appearance={clerkAppearance}
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/onboarding"
      />
    </div>
  );
}
