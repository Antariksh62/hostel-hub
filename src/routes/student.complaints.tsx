import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState, PageHeader } from "@/components/hms/app-shell";
import { ComplaintCard } from "@/components/hms/complaint-card";
import { MediaGallery } from "@/components/hms/media-gallery";
import { MediaUploader } from "@/components/hms/media-uploader";
import { ComplaintHeader, ComplaintMeta, DetailSection } from "@/components/hms/complaint-detail";
import { ComplaintTimeline } from "@/components/hms/complaint-timeline";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Complaint, ComplaintAttachment, ComplaintCategory } from "@/data/prototype-data";
import { releaseAttachment } from "@/lib/media";
import { useAuth } from "@/services/auth";
import { staffName, useHms } from "@/services/hms-store";

export const Route = createFileRoute("/student/complaints")({
  head: () => ({
    meta: [
      { title: "My complaints — Hostel Management System" },
      { name: "description", content: "Report hostel problems and follow every update until they are resolved." },
      { property: "og:title", content: "My complaints — Hostel Management System" },
      { property: "og:description", content: "Report hostel problems and follow every update." },
    ],
  }),
  component: StudentComplaints,
});

const CATEGORIES: ComplaintCategory[] = ["Electrical", "Plumbing", "Furniture", "Cleaning", "Internet", "Other"];

function StudentComplaints() {
  const { currentUser } = useAuth();
  const { complaints, createComplaint } = useHms();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [category, setCategory] = useState<ComplaintCategory>("Electrical");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<ComplaintAttachment[]>([]);

  const mine = complaints.filter((c) => c.studentEmail === currentUser?.email);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser?.student) return;
    if (!title.trim() || !description.trim()) return;
    createComplaint({
      category,
      title: title.trim().slice(0, 100),
      description: description.trim().slice(0, 600),
      room: currentUser.student.room,
      studentEmail: currentUser.email,
      studentName: currentUser.name,
      attachments,
    });
    setTitle("");
    setDescription("");
    setAttachments([]);
    setOpen(false);
    toast.success("Complaint submitted");
  }

  return (
    <>
      <PageHeader
        title="My complaints"
        description="Every request you have raised, newest first."
        action={
          <Button className="min-h-11" onClick={() => setOpen(true)}>
            <Plus className="size-4" aria-hidden />
            New complaint
          </Button>
        }
      />

      {mine.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No complaints yet"
          description="Report a maintenance problem and track its progress here."
          action={<Button onClick={() => setOpen(true)}>Report a problem</Button>}
        />
      ) : (
        <div className="space-y-3">
          {mine.map((c) => (
            <ComplaintCard key={c.id} complaint={c} onClick={() => setSelected(c)} />
          ))}
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o) {
            attachments.forEach(releaseAttachment);
            setAttachments([]);
          }
          setOpen(o);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report a problem</DialogTitle>
            <DialogDescription>
              Raised for room {currentUser?.student?.room}. Keep it short and specific.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ComplaintCategory)}>
                <SelectTrigger id="category" className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">What's wrong?</Label>
              <Input
                id="title"
                required
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ceiling fan not working"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Details</Label>
              <Textarea
                id="description"
                required
                maxLength={600}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add anything that helps the staff find and fix it."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complaint-media">Attachments (optional)</Label>
              <MediaUploader attachments={attachments} onChange={setAttachments} />
            </div>
            <DialogFooter>
              <Button type="submit" className="min-h-11 w-full">
                Submit complaint
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          {selected ? (
            <>
               <DialogHeader>
                 <ComplaintHeader
                   complaint={selected}
                   heading={<DialogTitle className="text-lg leading-6 text-balance">{selected.title}</DialogTitle>}
                 />
                 <DialogDescription className="sr-only">Complaint details and progress history</DialogDescription>
               </DialogHeader>
               <p className="text-sm leading-6 text-muted-foreground">{selected.description}</p>
               <ComplaintMeta
                 items={[
                   { label: "Room", value: selected.room },
                   { label: "Category", value: selected.category },
                   { label: "Assigned to", value: staffName(selected.assignedStaffId) ?? "Not assigned yet" },
                   { label: "Reported by", value: selected.studentName },
                 ]}
               />
               <DetailSection title="Evidence">
                 <MediaGallery attachments={selected.attachments} />
               </DetailSection>
               <DetailSection title="Progress">
                 <ComplaintTimeline complaint={selected} />
               </DetailSection>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
