import { ArrowUpRight, MapPin, Paperclip } from "lucide-react";
import type { ReactNode } from "react";

import { OverdueBadge, StatusBadge, relativeTime } from "@/components/hms/status";
import type { Complaint } from "@/data/prototype-data";
import { cn } from "@/lib/utils";

export function ComplaintCard({
  complaint,
  meta,
  footer,
  onClick,
  className,
}: {
  complaint: Complaint;
  meta?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium leading-5">{complaint.title}</p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" aria-hidden />
              Room {complaint.room}
            </span>
            <span aria-hidden>·</span>
            <span>{complaint.category}</span>
            <span aria-hidden>·</span>
            <span>{relativeTime(complaint.updatedAt)}</span>
            {complaint.attachments?.length ? (
              <>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <Paperclip className="size-3" aria-hidden />
                  {complaint.attachments.length} attachment
                  {complaint.attachments.length > 1 ? "s" : ""}
                </span>
              </>
            ) : null}
          </p>
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">{complaint.description}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <StatusBadge status={complaint.status} withIcon />
          {complaint.overdue && complaint.status !== "resolved" ? <OverdueBadge /> : null}
        </div>
      </div>
      {meta ? <div className="mt-3 text-xs text-muted-foreground">{meta}</div> : null}
      {footer ? <div className="mt-4 border-t border-border pt-3">{footer}</div> : null}
      {onClick ? (
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
          View complaint <ArrowUpRight className="size-3.5" aria-hidden />
        </span>
      ) : null}
    </>
  );

  const base = cn(
    "rounded-xl border border-border bg-card p-4 text-left shadow-xs transition-colors sm:p-5",
    onClick && "hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
    className,
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(base, "w-full")}>
        {body}
      </button>
    );
  }
  return <div className={base}>{body}</div>;
}
