import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState, PageHeader } from "@/components/hms/app-shell";
import { ComplaintCard } from "@/components/hms/complaint-card";
import { MediaGallery } from "@/components/hms/media-gallery";
import { StatCard } from "@/components/hms/stat-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CURRENT_STAFF_ID, type Complaint } from "@/data/prototype-data";
import { useHms } from "@/services/hms-store";

export const Route = createFileRoute("/staff/")({
  head: () => ({
    meta: [
      { title: "My work — Hostel Management System" },
      { name: "description", content: "Assigned hostel maintenance jobs with one-tap status updates." },
      { property: "og:title", content: "My work — Hostel Management System" },
      { property: "og:description", content: "Assigned hostel maintenance jobs for today." },
    ],
  }),
  component: StaffWork,
});

function StaffWork() {
  const { complaints, updateComplaintStatus } = useHms();
  const [resolving, setResolving] = useState<Complaint | null>(null);
  const [note, setNote] = useState("");
  const [detail, setDetail] = useState<Complaint | null>(null);

  const mine = complaints.filter((c) => c.assignedStaffId === CURRENT_STAFF_ID && c.status !== "resolved");
  const inProgress = mine.filter((c) => c.status === "in_progress");

  return (
    <>
      <PageHeader title="My work" description="Jobs assigned to you. Update the status as you go." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Open jobs" value={mine.length} tone="warning" />
        <StatCard label="In progress" value={inProgress.length} tone="info" />
        <StatCard label="Overdue" value={mine.filter((c) => c.overdue).length} tone="critical" />
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold">Assigned to me</h2>
      {mine.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="All clear" description="You have no open jobs right now." />
      ) : (
        <div className="space-y-3">
          {mine.map((c) => (
            <ComplaintCard
              key={c.id}
              complaint={c}
              meta={<span>Reported by {c.studentName}</span>}
              footer={
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="ghost" className="min-h-10" onClick={() => setDetail(c)}>
                    View details
                  </Button>
                  {c.status !== "in_progress" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="min-h-10"
                      onClick={() => {
                        updateComplaintStatus(c.id, "in_progress");
                        toast.success(`${c.id} marked in progress`);
                      }}
                    >
                      Start work
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    className="min-h-10"
                    onClick={() => {
                      setResolving(c);
                      setNote("");
                    }}
                  >
                    Mark resolved
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      )}

      <Dialog open={detail !== null} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
          {detail ? (
            <>
              <DialogHeader>
                <DialogTitle>{detail.title}</DialogTitle>
                <DialogDescription>
                  {detail.id} · Room {detail.room} · {detail.category}
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">{detail.description}</p>
              <p className="text-xs text-muted-foreground">Reported by {detail.studentName}</p>
              <MediaGallery attachments={detail.attachments} />
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={resolving !== null} onOpenChange={(o) => !o && setResolving(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Resolve {resolving?.id}</DialogTitle>
            <DialogDescription>Add a short note about what was done.</DialogDescription>
          </DialogHeader>
          <Textarea
            rows={4}
            maxLength={300}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Replaced the faulty switch and tested it."
          />
          <DialogFooter>
            <Button
              className="min-h-11 w-full"
              disabled={!note.trim()}
              onClick={() => {
                if (!resolving) return;
                updateComplaintStatus(resolving.id, "resolved", note.trim());
                toast.success(`${resolving.id} resolved`);
                setResolving(null);
              }}
            >
              Confirm resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
