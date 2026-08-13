import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ClipboardList, DoorOpen, Home, User } from "lucide-react";
import { useEffect } from "react";

import { AppShell } from "@/components/hms/app-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/auth";

export const Route = createFileRoute("/student")({ component: StudentLayout });

function StudentLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "student") void navigate({ to: "/" });
  }, [currentUser, navigate]);

  if (!currentUser?.student) return null;

  return (
    <AppShell
      product="Hostel Management"
      roleLabel="Student"
      userName={currentUser.name}
      userSubtitle={currentUser.subtitle}
      nav={[
        { to: "/student", label: "Home", icon: Home },
        { to: "/student/complaints", label: "Complaints", icon: ClipboardList },
        { to: "/student/room", label: "My room", icon: DoorOpen },
        { to: "/student/profile", label: "Profile", icon: User },
      ]}
      actions={
        <Button
          variant="ghost"
          className="min-h-11"
          onClick={() => {
            logout();
            void navigate({ to: "/" });
          }}
        >
          Sign out
        </Button>
      }
    >
      <Outlet />
    </AppShell>
  );
}
