/**
 * MOCK ATTACHMENTS — sample evidence bundled with the prototype.
 * These point at local files in `public/mock/`, not at any external service.
 */
import type { ComplaintAttachment } from "./prototype-data";

export const LEAK_EVIDENCE: ComplaintAttachment[] = [
  {
    id: "att-leak-1",
    type: "image",
    name: "washbasin-leak.jpg",
    url: "/mock/evidence-leak.jpg",
    size: 842_000,
    mimeType: "image/jpeg",
  },
  {
    id: "att-leak-2",
    type: "video",
    name: "dripping-pipe.mp4",
    url: "/mock/evidence-tap.mp4",
    size: 6_856,
    mimeType: "video/mp4",
  },
];

export const SOCKET_EVIDENCE: ComplaintAttachment[] = [
  {
    id: "att-socket-1",
    type: "image",
    name: "wall-socket.jpg",
    url: "/mock/evidence-socket.jpg",
    size: 736_000,
    mimeType: "image/jpeg",
  },
];

export const FLUSH_EVIDENCE: ComplaintAttachment[] = [
  {
    id: "att-flush-1",
    type: "video",
    name: "flush-tank.mp4",
    url: "/mock/evidence-tap.mp4",
    size: 6_856,
    mimeType: "video/mp4",
  },
  {
    id: "att-flush-2",
    type: "image",
    name: "tank-inside.jpg",
    url: "/mock/evidence-leak.jpg",
    size: 842_000,
    mimeType: "image/jpeg",
  },
];
