import { CheckCircle2, CircleDot, UserRoundCheck, Wrench } from "lucide-react";

import type { ComplaintStatus } from "@/data/prototype-data";
import { cn } from "@/lib/utils";

export const STATUS_LABEL: Record<ComplaintStatus, string> = {
  submitted: "Submitted",
  assigned: "Assigned",
  in_progress: "In progress",
  resolved: "Resolved",
};

const STATUS_STYLE: Record<ComplaintStatus, string> = {
  submitted:
    "bg-[var(--hms-info-soft)] text-[var(--hms-info-foreground)] ring-[var(--hms-info)]/25",
  assigned:
    "bg-[var(--hms-warning-soft)] text-[var(--hms-warning-foreground)] ring-[var(--hms-warning)]/25",
  in_progress:
    "bg-[var(--hms-warning-soft)] text-[var(--hms-warning-foreground)] ring-[var(--hms-warning)]/30",
  resolved:
    "bg-[var(--hms-success-soft)] text-[var(--hms-success-foreground)] ring-[var(--hms-success)]/25",
};

export function StatusBadge({
  status,
  withIcon = false,
  className,
}: {
  status: ComplaintStatus;
  withIcon?: boolean;
  className?: string;
}) {
  const Icon =
    status === "submitted"
      ? CircleDot
      : status === "assigned"
        ? UserRoundCheck
        : status === "in_progress"
          ? Wrench
          : CheckCircle2;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        STATUS_STYLE[status],
        className,
      )}
    >
      {withIcon ? <Icon className="mr-1.5 size-3.5" aria-hidden /> : null}
      {STATUS_LABEL[status]}
    </span>
  );
}

export function OverdueBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[var(--hms-critical-soft)] px-2.5 py-1 text-xs font-medium text-[var(--hms-critical-foreground)] ring-1 ring-inset ring-[var(--hms-critical)]/25",
        className,
      )}
    >
      Overdue
    </span>
  );
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
