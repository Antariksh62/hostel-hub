import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/hms/app-shell";
import { FLOOR_PLAN } from "@/data/prototype-data";
import { useHms } from "@/services/hms-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/warden/rooms")({
  head: () => ({
    meta: [
      { title: "Rooms — Hostel Management System" },
      { name: "description", content: "All 90 hostel rooms across five floors with occupancy and open complaints." },
      { property: "og:title", content: "Rooms — Hostel Management System" },
      { property: "og:description", content: "Occupancy and open issues for every hostel room." },
    ],
  }),
  component: WardenRooms,
});

function WardenRooms() {
  const { rooms, complaints } = useHms();
  const openByRoom = complaints.reduce<Record<string, number>>((acc, c) => {
    if (c.status !== "resolved") acc[c.room] = (acc[c.room] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageHeader title="Rooms" description="90 rooms · floors 1 to 5" />
      <div className="space-y-6">
        {FLOOR_PLAN.map(({ floor }) => (
          <section key={floor}>
            <h2 className="mb-2 text-sm font-semibold">Floor {floor}</h2>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-10">
              {rooms
                .filter((r) => r.floor === floor)
                .map((r) => {
                  const openCount = openByRoom[r.number] ?? 0;
                  return (
                    <div
                      key={r.number}
                      className={cn(
                        "rounded-lg border border-border p-2 text-center",
                        r.occupied ? "bg-card" : "bg-muted/60",
                      )}
                    >
                      <p className="text-sm font-medium tabular-nums">{r.number}</p>
                      <p
                        className={cn(
                          "mt-0.5 text-[11px]",
                          openCount > 0 ? "text-[var(--hms-critical-foreground)]" : "text-muted-foreground",
                        )}
                      >
                        {r.occupied ? (openCount > 0 ? `${openCount} open` : "OK") : "Vacant"}
                      </p>
                    </div>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
