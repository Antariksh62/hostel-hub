/**
 * Reusable, data-driven media gallery + in-app viewer.
 * Used by Student, Staff and Warden. It only receives attachment objects, so
 * swapping local object URLs for real hosted URLs later needs no UI change.
 */
import { ChevronLeft, ChevronRight, FileWarning, ImageIcon, Play, Video } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { ComplaintAttachment } from "@/data/prototype-data";
import { formatBytes } from "@/lib/media";
import { cn } from "@/lib/utils";

function Thumb({
  attachment,
  onOpen,
  overlay,
}: {
  attachment: ComplaintAttachment;
  onOpen: () => void;
  overlay?: string | undefined;
}) {
  const [failed, setFailed] = useState(false);
  const label =
    attachment.type === "image"
      ? `Photo evidence: ${attachment.name}`
      : `Video evidence: ${attachment.name}`;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${label}`}
      className="group relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {failed ? (
        <span className="flex size-full flex-col items-center justify-center gap-1 p-2 text-center text-[10px] text-muted-foreground">
          <FileWarning className="size-4" aria-hidden />
          Preview unavailable
        </span>
      ) : attachment.type === "image" ? (
        <img
          src={attachment.url}
          alt={label}
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full object-cover transition-transform group-hover:scale-[1.03]"
        />
      ) : (
        <>
          <video
            src={attachment.url}
            muted
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
            className="size-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-foreground/25">
            <span className="flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground">
              <Play className="size-4" aria-hidden />
            </span>
          </span>
        </>
      )}
      <span className="absolute bottom-1 left-1 inline-flex items-center gap-1 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
        {attachment.type === "image" ? (
          <ImageIcon className="size-3" aria-hidden />
        ) : (
          <Video className="size-3" aria-hidden />
        )}
        {attachment.type === "image" ? "Photo" : "Video"}
      </span>
      {overlay ? (
        <span className="absolute inset-0 flex items-center justify-center bg-background/80 text-sm font-semibold">
          {overlay}
        </span>
      ) : null}
    </button>
  );
}

export function MediaGallery({
  attachments,
  title = "Attachments",
  maxThumbs = 4,
  className,
}: {
  attachments: ComplaintAttachment[] | undefined;
  title?: string;
  maxThumbs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  if (!attachments || attachments.length === 0) return null;

  const visible = attachments.slice(0, maxThumbs);
  const hidden = attachments.length - visible.length;

  return (
    <section className={cn("space-y-2", className)}>
      <h3 className="text-xs font-medium text-muted-foreground">
        {title} ({attachments.length})
      </h3>
      <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {visible.map((a, i) => (
          <li key={a.id}>
            <Thumb
              attachment={a}
              onOpen={() => setIndex(i)}
              overlay={hidden > 0 && i === visible.length - 1 ? `+${hidden}` : undefined}
            />
          </li>
        ))}
      </ul>
      <MediaViewer
        attachments={attachments}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setIndex(null)}
      />
    </section>
  );
}

export function MediaViewer({
  attachments,
  index,
  onIndexChange,
  onClose,
}: {
  attachments: ComplaintAttachment[];
  index: number | null;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const current = index === null ? undefined : attachments[index];
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [index]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (index === null) return;
      if (e.key === "ArrowRight") onIndexChange((index + 1) % attachments.length);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + attachments.length) % attachments.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, attachments.length, onIndexChange]);

  if (!current) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92dvh] w-[calc(100vw-1.5rem)] gap-3 overflow-y-auto sm:max-w-2xl">
        <DialogTitle className="pr-8 text-sm break-all">{current.name}</DialogTitle>
        <DialogDescription className="text-xs">
          {current.type === "image" ? "Photo" : "Video"} · {formatBytes(current.size)} ·{" "}
          {(index ?? 0) + 1} of {attachments.length}
        </DialogDescription>

        <div className="flex min-h-40 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
          {failed ? (
            <p className="flex flex-col items-center gap-2 p-8 text-center text-sm text-muted-foreground">
              <FileWarning className="size-5" aria-hidden />
              This file cannot be previewed in the browser.
            </p>
          ) : current.type === "image" ? (
            <img
              src={current.url}
              alt={`Photo evidence: ${current.name}`}
              onError={() => setFailed(true)}
              className="max-h-[60dvh] w-full object-contain"
            />
          ) : (
            <video
              src={current.url}
              controls
              playsInline
              preload="metadata"
              onError={() => setFailed(true)}
              className="max-h-[60dvh] w-full"
            >
              <track kind="captions" />
            </video>
          )}
        </div>

        {attachments.length > 1 ? (
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              className="min-h-10"
              onClick={() => onIndexChange(((index ?? 0) - 1 + attachments.length) % attachments.length)}
            >
              <ChevronLeft className="size-4" aria-hidden />
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              {(index ?? 0) + 1} / {attachments.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="min-h-10"
              onClick={() => onIndexChange(((index ?? 0) + 1) % attachments.length)}
            >
              Next
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
