/**
 * PROTOTYPE MEDIA RULES — pure client-side helpers.
 * Nothing here uploads anything. Files picked in the browser are kept as local
 * object URLs so the prototype can render them; a real backend later returns
 * the same `ComplaintAttachment` shape with hosted URLs instead.
 */
import type { ComplaintAttachment } from "@/data/prototype-data";

export const MEDIA_LIMITS = {
  maxAttachments: 5,
  maxImageBytes: 10 * 1024 * 1024,
  maxVideoBytes: 50 * 1024 * 1024,
  imageTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  videoTypes: ["video/mp4", "video/webm", "video/quicktime"],
} as const;

export const MEDIA_ACCEPT = [...MEDIA_LIMITS.imageTypes, ...MEDIA_LIMITS.videoTypes].join(",");

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface MediaRejection {
  name: string;
  reason: string;
}

export interface MediaPickResult {
  accepted: ComplaintAttachment[];
  rejected: MediaRejection[];
}

/** Validates picked files and turns the valid ones into local attachments. */
export function pickAttachments(files: File[], existingCount: number): MediaPickResult {
  const accepted: ComplaintAttachment[] = [];
  const rejected: MediaRejection[] = [];
  let slots = MEDIA_LIMITS.maxAttachments - existingCount;

  for (const file of files) {
    const isImage = (MEDIA_LIMITS.imageTypes as readonly string[]).includes(file.type);
    const isVideo = (MEDIA_LIMITS.videoTypes as readonly string[]).includes(file.type);

    if (!isImage && !isVideo) {
      rejected.push({ name: file.name, reason: "Unsupported file type." });
      continue;
    }
    if (isImage && file.size > MEDIA_LIMITS.maxImageBytes) {
      rejected.push({ name: file.name, reason: "Image is too large. Maximum size is 10 MB." });
      continue;
    }
    if (isVideo && file.size > MEDIA_LIMITS.maxVideoBytes) {
      rejected.push({ name: file.name, reason: "Video is too large. Maximum size is 50 MB." });
      continue;
    }
    if (slots <= 0) {
      rejected.push({
        name: file.name,
        reason: `Only ${MEDIA_LIMITS.maxAttachments} attachments are allowed per complaint.`,
      });
      continue;
    }

    slots -= 1;
    accepted.push({
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: isImage ? "image" : "video",
      name: file.name,
      size: file.size,
      mimeType: file.type,
      // Local preview only — revoked when the attachment is removed.
      url: URL.createObjectURL(file),
      local: true,
    });
  }

  return { accepted, rejected };
}

export function releaseAttachment(attachment: ComplaintAttachment) {
  if (attachment.local) URL.revokeObjectURL(attachment.url);
}
