import { Link, createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Plus } from "lucide-react";

import { PageHeader, EmptyState } from "@/components/hms/app-shell";
import { ComplaintCard } from "@/components/hms/complaint-card";
import { StatCard } from "@/components/hms/stat-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/auth";
import { useHms } from "@/services/hms-store";

export const Route = createFileRoute("/student/")({
  head: () => ({
    meta: [
      { title: "Student home — Hostel Management System" },
      { name: "description", content: "Track your hostel complaints and room details in one place." },
      { property: "og:title", content: "Student home — Hostel Management System" },
      { property: "og:description", content: "Track your hostel complaints and room details." },
    ],
  }),
  component: StudentHome,
});

function StudentHome() {
  const { currentUser } = useAuth();
  const { complaints } = useHms();
  const mine = complaints.filter((c) => c.studentEmail === currentUser?.email);
  const open = mine.filter((c) => c.status !== "resolved");

  return (
    <>
      <PageHeader
        title={`Hello, ${currentUser?.name.split(" ")[0] ?? "there"}`}
        description="Here's what's happening with your requests."
        action={
          <Button asChild className="min-h-11">
            <Link to="/student/complaints">
              <Plus className="size-4" aria-hidden />
              Report a problem
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Open" value={open.length} tone="warning" />
        <StatCard label="Resolved" value={mine.length - open.length} tone="success" />
        <StatCard label="Room" value={currentUser?.student?.room ?? "—"} />
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold">Active requests</h2>
      {open.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Nothing open"
          description="When you report a problem it will appear here with its live status."
        />
      ) : (
        <div className="space-y-3">
          {open.map((c) => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </div>
      )}
    </>
  );
}
