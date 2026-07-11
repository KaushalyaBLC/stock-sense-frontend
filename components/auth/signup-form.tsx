"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Check, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignupMutation, parseRtkError } from "@/lib/store/auth-api";
import { useAppDispatch } from "@/lib/store/hooks";
import { setUser } from "@/lib/store/auth-slice";
import { cn } from "@/lib/utils";

// Mirror the backend rules (auth.schemas.js): 8–72 chars, ≥1 letter, ≥1 number.
const rules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "A letter", test: (p: string) => /[A-Za-z]/.test(p) },
  { label: "A number", test: (p: string) => /[0-9]/.test(p) },
];

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export function SignupForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signup, { isLoading }] = useSignupMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);

  const pwOk = rules.every((r) => r.test(password));
  const matchOk = confirm.length > 0 && confirm === password;
  const nameOk = name.trim().length > 0;
  const canSubmit = nameOk && emailOk(email) && pwOk && matchOk && !isLoading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!canSubmit) return;
    try {
      const res = await signup({
        email: email.trim(),
        password,
        name: name.trim(),
      }).unwrap();

      if (!res.email_confirmation_required) {
        // Registered and logged straight in (cookies set by the BFF route).
        dispatch(setUser(res.user));
        toast.success("Account created. Welcome to StockSense.");
        router.push("/dashboard");
        router.refresh();
      } else {
        // Confirmation required — show the check-your-email state.
        setConfirmEmail(email.trim());
      }
    } catch (err) {
      const { code, message } = parseRtkError(err);
      setError(
        code === "email_taken"
          ? "An account with this email already exists."
          : message,
      );
    }
  }

  if (confirmEmail) {
    return (
      <div className="rounded-[10px] border border-border bg-card p-6 text-center">
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-brand-soft text-primary">
          <MailCheck className="size-5" />
        </span>
        <h2 className="mt-4 text-base font-semibold">Confirm your email</h2>
        <p className="mt-2 text-sm text-text-secondary">
          We sent a confirmation link to{" "}
          <span className="font-medium text-foreground">{confirmEmail}</span>.
          Click it to activate your account, then sign in.
        </p>
        <Button asChild variant="outline" className="mt-5 w-full">
          <a href="/login">Go to sign in</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Jane Perera"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 grid w-10 place-items-center text-text-muted hover:text-foreground"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        {/* Live requirement chips */}
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {rules.map((r) => {
            const ok = r.test(password);
            return (
              <span
                key={r.label}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition-colors",
                  ok
                    ? "border-up/30 bg-up/10 text-up-strong"
                    : "border-border bg-surface-2 text-text-muted",
                )}
              >
                <Check
                  className={cn("size-2.5", ok ? "opacity-100" : "opacity-40")}
                  strokeWidth={3}
                />
                {r.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirm">Confirm password</Label>
        <Input
          id="confirm"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={confirm.length > 0 && !matchOk}
          className={cn(
            confirm.length > 0 && !matchOk &&
              "border-destructive focus-visible:ring-destructive/40",
          )}
          required
        />
        {confirm.length > 0 && !matchOk && (
          <p className="text-xs text-destructive">Passwords don&apos;t match.</p>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-[6px] border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <Button type="submit" disabled={!canSubmit} className="mt-1 h-11">
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}
