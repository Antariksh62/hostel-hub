import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/hms/app-shell";
import { useHms } from "@/services/hms-store";

export const Route = createFileRoute("/warden/staff")({
  head: () => ({
    meta: [
      { title: "Staff workload — Hostel Management System" },
      { name: "description", content: "Maintenance staff list with current workload and completed jobs." },
      { property: "og:title", content: "Staff workload — Hostel Management System" },
      { property: "og:description", content: "Maintenance staff workload across the hostel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WardenStaff,
});

function WardenStaff() {
  const { staff, complaints } = useHms();

  return (
    <>
      <PageHeader title="Staff" description="Workload across the maintenance team." />
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {staff.map((s) => {
          const assigned = complaints.filter((c) => c.assignedStaffId === s.id);
          const open = assigned.filter((c) => c.status !== "resolved").length;
          return (
            <div key={s.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{s.name}</p>
                <p className="truncate text-xs text-muted-foreground">{s.trade}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-medium tabular-nums">{open} open</p>
                <p className="text-xs text-muted-foreground tabular-nums">{assigned.length - open} done</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
