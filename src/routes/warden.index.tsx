import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/hms/app-shell";
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
      <PageHeader title="Overview" description="Current state of the hostel." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Open complaints" value={open.length} tone="warning" />
        <StatCard label="Unassigned" value={unassigned.length} tone="info" />
        <StatCard label="Overdue" value={overdue.length} tone="critical" />
        <StatCard label="Resolved" value={complaints.length - open.length} tone="success" />
        <StatCard label="Rooms occupied" value={`${occupied}/${rooms.length}`} />
        <StatCard label="Vacant rooms" value={rooms.length - occupied} />
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold">Needs attention</h2>
      <div className="space-y-3">
        {[...overdue, ...unassigned].slice(0, 6).map((c) => (
          <ComplaintCard
            key={c.id}
            complaint={c}
            meta={<span>{staffName(c.assignedStaffId) ?? "Not assigned"} · {c.studentName}</span>}
          />
        ))}
      </div>
    </>
  );
}
