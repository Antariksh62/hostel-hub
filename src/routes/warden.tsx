import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ClipboardList, DoorOpen, LayoutDashboard, Users } from "lucide-react";
import { useEffect } from "react";

import { AppShell } from "@/components/hms/app-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/auth";

export const Route = createFileRoute("/warden")({ component: WardenLayout });

function WardenLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "warden") void navigate({ to: "/" });
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <AppShell
      product="Hostel Management"
      roleLabel="Warden"
      userName={currentUser.name}
      userSubtitle={currentUser.subtitle}
      nav={[
        { to: "/warden", label: "Overview", icon: LayoutDashboard },
        { to: "/warden/complaints", label: "Complaints", icon: ClipboardList },
        { to: "/warden/rooms", label: "Rooms", icon: DoorOpen },
        { to: "/warden/staff", label: "Staff", icon: Users },
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
