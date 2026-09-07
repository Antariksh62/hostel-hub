import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/hms/app-shell";
import { ComplaintCard } from "@/components/hms/complaint-card";
import { useAuth } from "@/services/auth";
import { useHms } from "@/services/hms-store";

export const Route = createFileRoute("/student/room")({
  head: () => ({
    meta: [
      { title: "My room — Hostel Management System" },
      { name: "description", content: "Room allotment details and the maintenance history for your hostel room." },
      { property: "og:title", content: "My room — Hostel Management System" },
      { property: "og:description", content: "Room allotment details and maintenance history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StudentRoom,
});

function StudentRoom() {
  const { currentUser } = useAuth();
  const { complaints, rooms } = useHms();
  const room = rooms.find((r) => r.number === currentUser?.student?.room);
  const history = complaints.filter((c) => c.room === room?.number);

  return (
    <>
      <PageHeader title={`Room ${room?.number ?? "—"}`} description={`Floor ${room?.floor ?? "—"} · Shared room`} />

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          ["Room number", room?.number ?? "—"],
          ["Floor", String(room?.floor ?? "—")],
          ["Occupancy", room?.occupied ? "Occupied" : "Vacant"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-8 mb-3 text-sm font-semibold">Maintenance history for this room</h2>
      <div className="space-y-3">
        {history.map((c) => (
          <ComplaintCard key={c.id} complaint={c} />
        ))}
      </div>
    </>
  );
}
