import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/hms/app-shell";
import { CURRENT_STAFF_ID, staff } from "@/data/prototype-data";
import { useAuth } from "@/services/auth";

export const Route = createFileRoute("/staff/profile")({
  head: () => ({
    meta: [
      { title: "Staff profile — Hostel Management System" },
      { name: "description", content: "Your maintenance staff profile and assigned trade in the hostel." },
      { property: "og:title", content: "Staff profile — Hostel Management System" },
      { property: "og:description", content: "Maintenance staff profile and trade." },
    ],
  }),
  component: StaffProfile,
});

function StaffProfile() {
  const { currentUser } = useAuth();
  const me = staff.find((s) => s.id === CURRENT_STAFF_ID);
  const rows: [string, string][] = [
    ["Name", currentUser?.name ?? "—"],
    ["Email", currentUser?.email ?? "—"],
    ["Trade", me?.trade ?? "—"],
    ["Staff ID", CURRENT_STAFF_ID.toUpperCase()],
  ];

  return (
    <>
      <PageHeader title="Profile" description="Your staff record." />
      <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="truncate text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
