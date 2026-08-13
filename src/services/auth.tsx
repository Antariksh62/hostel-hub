/**
 * PROTOTYPE AUTH LAYER — mock only.
 * No backend, no JWT, no hashing, no email or OTP delivery. The real HMS
 * authentication replaces this module; UI components never contain auth logic.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { inchargeProfile, students, wardenProfile, type StudentProfile } from "@/data/prototype-data";

export type Role = "student" | "staff" | "warden" | "incharge";

export interface CurrentUser {
  role: Role;
  name: string;
  email: string;
  subtitle: string;
  student?: StudentProfile;
}

export const STUDENT_EMAIL_DOMAIN = "@ms.pict.edu";

/** Mock codes that demonstrate the invalid / expired states. */
export const MOCK_WRONG_OTP = "000000";
export const MOCK_EXPIRED_OTP = "111111";

export type OtpResult =
  | { ok: true; existing: true; profile: StudentProfile }
  | { ok: true; existing: false }
  | { ok: false; reason: "invalid" | "expired" };

interface AuthContextValue {
  currentUser: CurrentUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (role: Exclude<Role, "student">, email: string, password: string) => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<OtpResult>;
  signInStudent: (profile: StudentProfile) => void;
  registerStudent: (profile: StudentProfile) => Promise<StudentProfile>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const delay = (ms = 650) => new Promise<void>((r) => setTimeout(r, ms));

const staffAccount = {
  name: "Ramesh Pawar",
  email: "staff@hostel.local",
  subtitle: "Maintenance — Electrical",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [registered, setRegistered] = useState<StudentProfile[]>(students);

  const login = useCallback(async (role: Exclude<Role, "student">, email: string, password: string) => {
    await delay();
    // Mock rule: any non-empty password of 4+ characters signs in.
    if (password.trim().length < 4) {
      throw new Error("Incorrect email or password.");
    }
    if (role === "staff") {
      setCurrentUser({ role, name: staffAccount.name, email, subtitle: staffAccount.subtitle });
    } else if (role === "warden") {
      setCurrentUser({ role, name: wardenProfile.name, email, subtitle: wardenProfile.title });
    } else {
      setCurrentUser({ role, name: inchargeProfile.name, email, subtitle: inchargeProfile.title });
    }
  }, []);

  const sendOtp = useCallback(async (_email: string) => {
    await delay(700);
  }, []);

  const verifyOtp = useCallback(
    async (email: string, code: string): Promise<OtpResult> => {
      await delay();
      if (code === MOCK_EXPIRED_OTP) return { ok: false, reason: "expired" };
      if (code === MOCK_WRONG_OTP || !/^\d{6}$/.test(code)) return { ok: false, reason: "invalid" };
      const profile = registered.find((s) => s.email.toLowerCase() === email.toLowerCase());
      return profile ? { ok: true, existing: true, profile } : { ok: true, existing: false };
    },
    [registered],
  );

  const signInStudent = useCallback((profile: StudentProfile) => {
    setCurrentUser({
      role: "student",
      name: profile.fullName,
      email: profile.email,
      subtitle: `Room ${profile.room} · Floor ${profile.room[0]}`,
      student: profile,
    });
  }, []);

  const registerStudent = useCallback(
    async (profile: StudentProfile) => {
      await delay(800);
      setRegistered((prev) => [...prev, profile]);
      signInStudent(profile);
      return profile;
    },
    [signInStudent],
  );

  const logout = useCallback(() => setCurrentUser(null), []);

  const value = useMemo(
    () => ({
      currentUser,
      role: currentUser?.role ?? null,
      isAuthenticated: currentUser !== null,
      login,
      sendOtp,
      verifyOtp,
      signInStudent,
      registerStudent,
      logout,
    }),
    [currentUser, login, sendOtp, verifyOtp, signInStudent, registerStudent, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
