import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { History, User, Wrench } from "lucide-react";
import { useEffect } from "react";

import { AppShell } from "@/components/hms/app-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/auth";

export const Route = createFileRoute("/staff")({ component: StaffLayout });

function StaffLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "staff") void navigate({ to: "/" });
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <AppShell
      product="Hostel Management"
      roleLabel="Maintenance staff"
      userName={currentUser.name}
      userSubtitle={currentUser.subtitle}
      nav={[
        { to: "/staff", label: "My work", icon: Wrench },
        { to: "/staff/history", label: "History", icon: History },
        { to: "/staff/profile", label: "Profile", icon: User },
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
