import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, Plus } from "lucide-react";

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
         <StatCard label="Open requests" value={open.length} tone="warning" hint="Need attention" />
         <StatCard label="Resolved" value={mine.length - open.length} tone="success" hint="Completed" />
         <StatCard label="Your room" value={currentUser?.student?.room ?? "—"} hint="Current allocation" />
      </div>

       <div className="mt-9 mb-3 flex items-center justify-between gap-3">
         <div>
           <h2 className="text-base font-semibold">Active requests</h2>
           <p className="mt-0.5 text-sm text-muted-foreground">The latest status of problems you reported.</p>
         </div>
         <Link
           to="/student/complaints"
           className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
         >
           View all <ArrowRight className="size-4" aria-hidden />
         </Link>
       </div>
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
