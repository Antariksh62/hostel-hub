import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ClipboardCheck, DoorOpen, Inbox, TriangleAlert } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/hms/app-shell";
import { ComplaintCard } from "@/components/hms/complaint-card";
import { StatCard } from "@/components/hms/stat-card";
import { staffName, useHms } from "@/services/hms-store";

export const Route = createFileRoute("/warden/")({
  head: () => ({
    meta: [
      { title: "Warden overview — Hostel Management System" },
      { name: "description", content: "Hostel-wide view of open complaints, overdue work and room occupancy." },
      { property: "og:title", content: "Warden overview — Hostel Management System" },
      { property: "og:description", content: "Open complaints, overdue work and occupancy at a glance." },
    ],
  }),
  component: WardenOverview,
});

function WardenOverview() {
  const { complaints, rooms } = useHms();
  const open = complaints.filter((c) => c.status !== "resolved");
  const unassigned = open.filter((c) => !c.assignedStaffId);
  const overdue = open.filter((c) => c.overdue);
  const occupied = rooms.filter((r) => r.occupied).length;

  return (
    <>
       <PageHeader
         title="Overview"
         description="A focused view of what needs attention across the hostel."
         action={
           <Link
             to="/warden/complaints"
             className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm font-medium transition-colors hover:bg-accent"
           >
             Open complaints <ArrowRight className="size-4" aria-hidden />
           </Link>
         }
       />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
         <StatCard label="Open complaints" value={open.length} tone="warning" hint="Across all floors" icon={Inbox} />
         <StatCard label="Unassigned" value={unassigned.length} tone="info" hint="Waiting for ownership" icon={ClipboardCheck} />
         <StatCard label="Overdue" value={overdue.length} tone="critical" hint="Needs priority" icon={TriangleAlert} />
         <StatCard label="Resolved" value={complaints.length - open.length} tone="success" hint="Completed" />
         <StatCard label="Rooms occupied" value={`${occupied}/${rooms.length}`} hint="Current occupancy" icon={DoorOpen} />
         <StatCard label="Vacant rooms" value={rooms.length - occupied} hint="Available rooms" />
      </div>

       <div className="mt-9 mb-3 flex items-end justify-between gap-3">
         <div>
           <h2 className="text-base font-semibold">Needs attention</h2>
           <p className="mt-0.5 text-sm text-muted-foreground">Prioritised by urgency and assignment status.</p>
         </div>
         <span className="shrink-0 text-xs text-muted-foreground">{Math.min(6, new Set([...overdue, ...unassigned].map((c) => c.id)).size)} shown</span>
       </div>
       {[...new Map([...overdue, ...unassigned].map((c) => [c.id, c])).values()].slice(0, 6).length === 0 ? (
         <EmptyState icon={ClipboardCheck} title="Nothing needs attention" description="Open complaints are assigned and within their expected response time." />
       ) : (
         <div className="space-y-3">
           {[...new Map([...overdue, ...unassigned].map((c) => [c.id, c])).values()].slice(0, 6).map((c) => (
          <ComplaintCard
            key={c.id}
            complaint={c}
            meta={<span>{staffName(c.assignedStaffId) ?? "Not assigned"} · {c.studentName}</span>}
          />
           ))}
         </div>
       )}
    </>
  );
}
