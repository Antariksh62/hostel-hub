import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/hms/app-shell";
import { ComplaintCard } from "@/components/hms/complaint-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ComplaintStatus } from "@/data/prototype-data";
import { staffName, useHms } from "@/services/hms-store";

export const Route = createFileRoute("/warden/complaints")({
  head: () => ({
    meta: [
      { title: "All complaints — Hostel Management System" },
      { name: "description", content: "Review every hostel complaint and assign it to the right maintenance staff." },
      { property: "og:title", content: "All complaints — Hostel Management System" },
      { property: "og:description", content: "Review and assign hostel complaints." },
    ],
  }),
  component: WardenComplaints,
});

const FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
];

function WardenComplaints() {
  const { complaints, staff, assignComplaint } = useHms();
  const [filter, setFilter] = useState("all");

  const list = complaints.filter((c) => filter === "all" || c.status === (filter as ComplaintStatus));

  return (
    <>
      <PageHeader
        title="Complaints"
        description={`${list.length} shown`}
        action={
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-11 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILTERS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="space-y-3">
        {list.map((c) => (
          <ComplaintCard
            key={c.id}
            complaint={c}
            meta={<span>{c.studentName} · {staffName(c.assignedStaffId) ?? "Unassigned"}</span>}
            footer={
              c.status === "resolved" ? null : (
                <Select
                  value={c.assignedStaffId ?? ""}
                  onValueChange={(v) => {
                    assignComplaint(c.id, v);
                    toast.success(`${c.id} assigned to ${staffName(v)}`);
                  }}
                >
                  <SelectTrigger className="h-10 w-full sm:w-64">
                    <SelectValue placeholder="Assign staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} — {s.trade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            }
          />
        ))}
      </div>
    </>
  );
}
