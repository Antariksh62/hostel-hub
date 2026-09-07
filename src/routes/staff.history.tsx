import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/hms/app-shell";
import { ComplaintCard } from "@/components/hms/complaint-card";
import { CURRENT_STAFF_ID } from "@/data/prototype-data";
import { useHms } from "@/services/hms-store";

export const Route = createFileRoute("/staff/history")({
  head: () => ({
    meta: [
      { title: "Work history — Hostel Management System" },
      { name: "description", content: "Jobs you have completed, with the resolution note recorded for each." },
      { property: "og:title", content: "Work history — Hostel Management System" },
      { property: "og:description", content: "Completed hostel maintenance jobs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StaffHistory,
});

function StaffHistory() {
  const { complaints } = useHms();
  const done = complaints.filter((c) => c.assignedStaffId === CURRENT_STAFF_ID && c.status === "resolved");

  return (
    <>
       <PageHeader title="History" description={`${done.length} completed ${done.length === 1 ? "job" : "jobs"}.`} />
      {done.length === 0 ? (
        <EmptyState icon={History} title="Nothing completed yet" description="Resolved jobs will be listed here." />
      ) : (
        <div className="space-y-3">
          {done.map((c) => (
            <ComplaintCard key={c.id} complaint={c} meta={c.resolutionNote ? <span>{c.resolutionNote}</span> : null} />
          ))}
        </div>
      )}
    </>
  );
}
