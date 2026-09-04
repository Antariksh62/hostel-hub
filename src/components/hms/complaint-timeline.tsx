import { Check } from "lucide-react";

import { formatDateTime } from "@/components/hms/status";
import type { Complaint, ComplaintStatus } from "@/data/prototype-data";
import { cn } from "@/lib/utils";

const ORDER: ComplaintStatus[] = ["submitted", "assigned", "in_progress", "resolved"];

const LABELS: Record<"student" | "staff", Record<ComplaintStatus, string>> = {
  student: {
    submitted: "Submitted",
    assigned: "Assigned to maintenance",
    in_progress: "Work in progress",
    resolved: "Resolved",
  },
  staff: {
    submitted: "Complaint raised",
    assigned: "Assigned to you",
    in_progress: "Work started",
    resolved: "Resolved",
  },
};

const PENDING_HINT: Record<ComplaintStatus, string> = {
  submitted: "Not submitted",
  assigned: "Waiting for assignment",
  in_progress: "Work not started yet",
  resolved: "Not resolved yet",
};

/**
 * Lifecycle view of a complaint. Only entries that exist in `complaint.timeline`
 * are shown as completed — remaining stages render as upcoming, never with an
 * invented timestamp.
 */
export function ComplaintTimeline({
  complaint,
  variant = "student",
  className,
}: {
  complaint: Complaint;
  variant?: "student" | "staff";
  className?: string;
}) {
  const labels = LABELS[variant];
  const currentIndex = ORDER.indexOf(complaint.status);

  return (
    <ol className={cn("relative", className)}>
      {ORDER.map((status, i) => {
        const entry = complaint.timeline.find((t) => t.status === status);
        const state: "done" | "current" | "upcoming" = entry
          ? i === currentIndex
            ? "current"
            : "done"
          : "upcoming";
        const last = i === ORDER.length - 1;

        return (
          <li key={status} className="relative flex gap-3 pb-4 last:pb-0">
            {!last ? (
              <span
                aria-hidden
                className={cn(
                  "absolute top-5 bottom-0 left-[9px] w-px",
                  state === "upcoming" ? "bg-border" : "bg-[var(--hms-info)]/35",
                )}
              />
            ) : null}
            <span
              aria-hidden
              className={cn(
                "relative z-10 mt-0.5 grid size-[19px] shrink-0 place-items-center rounded-full border",
                state === "done" && "border-transparent bg-[var(--hms-info)] text-[var(--primary-foreground)]",
                state === "current" &&
                  "border-[var(--hms-info)] bg-background ring-4 ring-[var(--hms-info)]/12",
                state === "upcoming" && "border-dashed border-border bg-background",
              )}
            >
              {state === "done" ? <Check className="size-3" strokeWidth={3} /> : null}
              {state === "current" ? (
                <span className="size-[7px] rounded-full bg-[var(--hms-info)]" />
              ) : null}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm leading-5",
                  state === "upcoming" ? "text-muted-foreground" : "font-medium",
                )}
              >
                {labels[status]}
                {state === "current" ? (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">Current</span>
                ) : null}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                {entry ? formatDateTime(entry.at) : PENDING_HINT[status]}
              </p>
              {entry?.note ? (
                <p className="mt-1.5 text-sm text-muted-foreground">{entry.note}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
