import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { StudentProfile } from "@/data/prototype-data";
import { ThemeToggle } from "@/lib/theme";
import { STUDENT_EMAIL_DOMAIN, useAuth, type Role } from "@/services/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — Hostel Management System" },
      {
        name: "description",
        content:
          "Sign in to the college Hostel Management System as a student, maintenance staff member or warden.",
      },
      { property: "og:title", content: "Sign in — Hostel Management System" },
      {
        property: "og:description",
        content: "Role-based access for students, staff and wardens of the college hostel.",
      },
    ],
  }),
  component: LoginPage,
});

type Step = "identity" | "otp" | "register" | "password";

function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [role, setRole] = useState<Exclude<Role, "incharge">>("student");
  const [step, setStep] = useState<Step>("identity");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    prn: "",
    branch: "",
    joiningYear: "",
    rollNumber: "",
    division: "",
    academicYear: "",
    room: "",
  });

  function switchRole(next: string) {
    setRole(next as Exclude<Role, "incharge">);
    setStep("identity");
    setError(null);
    setNotice(null);
    setOtp("");
    setPassword("");
  }

  async function handleIdentity(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (role === "student") {
      if (!email.trim().toLowerCase().endsWith(STUDENT_EMAIL_DOMAIN)) {
        setError(`Use your college email ending in ${STUDENT_EMAIL_DOMAIN}`);
        return;
      }
      setBusy(true);
      await auth.sendOtp(email.trim());
      setBusy(false);
      setNotice("A 6-digit code was sent to your college email.");
      setStep("otp");
      return;
    }
    setStep("password");
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = await auth.verifyOtp(email.trim(), otp);
    setBusy(false);
    if (!result.ok) {
      setError(result.reason === "expired" ? "That code has expired. Request a new one." : "Incorrect code. Try again.");
      return;
    }
    if (result.existing) {
      auth.signInStudent(result.profile);
      void navigate({ to: "/student" as "/" });
    } else {
      setNotice("First time here — complete your hostel profile.");
      setStep("register");
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const missing = Object.values(form).some((v) => !v.trim());
    if (missing) {
      setError("Please fill in every field.");
      return;
    }
    setBusy(true);
    const profile: StudentProfile = { email: email.trim(), ...form };
    await auth.registerStudent(profile);
    setBusy(false);
    void navigate({ to: "/student" as "/" });
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await auth.login(role as "staff" | "warden", email.trim(), password);
      void navigate({ to: (role === "staff" ? "/staff" : "/warden") as "/" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="hms-root flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Building2 className="size-5 text-primary" aria-hidden />
          <span className="text-sm font-semibold tracking-tight">Hostel Management System</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16 sm:px-6">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose your role to continue. This is a UI prototype — no real accounts are used.
          </p>

          <Tabs value={role} onValueChange={switchRole} className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="warden">Warden</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-5 rounded-xl border border-border bg-card p-5">
            {step === "identity" ? (
              <form onSubmit={handleIdentity} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{role === "student" ? "College email" : "Work email"}</Label>
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    maxLength={120}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === "student" ? `you${STUDENT_EMAIL_DOMAIN}` : "you@hostel.local"}
                    className="h-11"
                  />
                  {role === "student" ? (
                    <p className="text-xs text-muted-foreground">
                      Only {STUDENT_EMAIL_DOMAIN} addresses can request a code.
                    </p>
                  ) : null}
                </div>
                {error ? <p className="text-sm text-[var(--hms-critical-foreground)]">{error}</p> : null}
                <Button type="submit" className="h-11 w-full" disabled={busy}>
                  {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                  {role === "student" ? "Send code" : "Continue"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Demo: student@ms.pict.edu · staff@hostel.local · warden@hostel.local
                </p>
              </form>
            ) : null}

            {step === "otp" ? (
              <form onSubmit={handleOtp} className="space-y-4">
                <BackLink onClick={() => setStep("identity")} />
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter the 6-digit code</Label>
                  <InputOTP id="otp" maxLength={6} value={otp} onChange={setOtp} containerClassName="justify-between">
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot key={i} index={i} className="size-11 rounded-md border" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  {notice ? <p className="text-xs text-muted-foreground">{notice}</p> : null}
                </div>
                {error ? <p className="text-sm text-[var(--hms-critical-foreground)]">{error}</p> : null}
                <Button type="submit" className="h-11 w-full" disabled={busy || otp.length !== 6}>
                  {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                  Verify
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-11 w-full"
                  onClick={() => {
                    setOtp("");
                    setError(null);
                    setNotice("A new code was sent.");
                  }}
                >
                  Resend code
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Any 6 digits work. 000000 is invalid, 111111 is expired.
                </p>
              </form>
            ) : null}

            {step === "register" ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <BackLink onClick={() => setStep("otp")} />
                <p className="text-sm text-muted-foreground">{notice}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Full name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} className="sm:col-span-2" />
                  <Field label="PRN" value={form.prn} onChange={(v) => setForm({ ...form, prn: v })} />
                  <Field label="Branch" value={form.branch} onChange={(v) => setForm({ ...form, branch: v })} />
                  <Field label="Joining year" value={form.joiningYear} onChange={(v) => setForm({ ...form, joiningYear: v })} />
                  <Field label="Roll number" value={form.rollNumber} onChange={(v) => setForm({ ...form, rollNumber: v })} />
                  <Field label="Division" value={form.division} onChange={(v) => setForm({ ...form, division: v })} />
                  <Field label="Academic year" value={form.academicYear} onChange={(v) => setForm({ ...form, academicYear: v })} />
                  <Field label="Room number" value={form.room} onChange={(v) => setForm({ ...form, room: v })} className="sm:col-span-2" />
                </div>
                {error ? <p className="text-sm text-[var(--hms-critical-foreground)]">{error}</p> : null}
                <Button type="submit" className="h-11 w-full" disabled={busy}>
                  {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                  Create profile
                </Button>
              </form>
            ) : null}

            {step === "password" ? (
              <form onSubmit={handlePassword} className="space-y-4">
                <BackLink onClick={() => setStep("identity")} />
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    maxLength={72}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">Prototype: any password of 4+ characters signs in.</p>
                </div>
                {error ? <p className="text-sm text-[var(--hms-critical-foreground)]">{error}</p> : null}
                <Button type="submit" className="h-11 w-full" disabled={busy}>
                  {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                  Sign in
                </Button>
              </form>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="size-4" aria-hidden />
      Back
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      <Input id={id} value={value} maxLength={60} onChange={(e) => onChange(e.target.value)} className="h-11" />
    </div>
  );
}
