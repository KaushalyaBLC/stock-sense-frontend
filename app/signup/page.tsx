import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create your account — StockSense",
  description: "Sign up to get AI-driven, explained signals for CSE stocks.",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start reading the market with clarity — it only takes a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
