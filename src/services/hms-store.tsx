/**
 * PROTOTYPE SERVICE LAYER — local state only, no network.
 * Replace this module with the real HMS API/service layer; components consume
 * it exclusively through the `useHms()` hook and never import mock data directly.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import {
  complaints as seedComplaints,
  rooms,
  staff,
  type Complaint,
  type ComplaintAttachment,
  type ComplaintCategory,
  type ComplaintStatus,
} from "@/data/prototype-data";

interface NewComplaintInput {
  category: ComplaintCategory;
  title: string;
  description: string;
  room: string;
  studentEmail: string;
  studentName: string;
  attachments?: ComplaintAttachment[];
}

interface HmsContextValue {
  complaints: Complaint[];
  rooms: typeof rooms;
  staff: typeof staff;
  createComplaint: (input: NewComplaintInput) => Complaint;
  updateComplaintStatus: (id: string, status: ComplaintStatus, note?: string) => void;
  assignComplaint: (id: string, staffId: string) => void;
}

const HmsContext = createContext<HmsContextValue | null>(null);

let counter = 1100;

export function HmsProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Complaint[]>(seedComplaints);

  const createComplaint = useCallback((input: NewComplaintInput) => {
    const now = new Date().toISOString();
    counter += 1;
    const complaint: Complaint = {
      id: `CMP-${counter}`,
      room: input.room,
      floor: Number(input.room[0]),
      category: input.category,
      title: input.title,
      description: input.description,
      status: "submitted",
      createdAt: now,
      updatedAt: now,
      studentEmail: input.studentEmail,
      studentName: input.studentName,
      ...(input.attachments?.length ? { attachments: input.attachments } : {}),
      timeline: [{ status: "submitted", at: now }],
    };
    setList((prev) => [complaint, ...prev]);
    return complaint;
  }, []);

  const updateComplaintStatus = useCallback((id: string, status: ComplaintStatus, note?: string) => {
    const now = new Date().toISOString();
    setList((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              updatedAt: now,
              ...(status === "resolved" ? { overdue: false } : {}),
              ...(status === "resolved" && note ? { resolutionNote: note } : {}),
              timeline: [...c.timeline, { status, at: now, ...(note ? { note } : {}) }],
            }
          : c,
      ),
    );
  }, []);

  const assignComplaint = useCallback((id: string, staffId: string) => {
    const now = new Date().toISOString();
    setList((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              assignedStaffId: staffId,
              status: c.status === "submitted" ? "assigned" : c.status,
              updatedAt: now,
              timeline:
                c.status === "submitted"
                  ? [...c.timeline, { status: "assigned" as ComplaintStatus, at: now }]
                  : c.timeline,
            }
          : c,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({ complaints: list, rooms, staff, createComplaint, updateComplaintStatus, assignComplaint }),
    [list, createComplaint, updateComplaintStatus, assignComplaint],
  );

  return <HmsContext.Provider value={value}>{children}</HmsContext.Provider>;
}

export function useHms() {
  const ctx = useContext(HmsContext);
  if (!ctx) throw new Error("useHms must be used inside HmsProvider");
  return ctx;
}

export function staffName(staffId: string | undefined) {
  return staff.find((s) => s.id === staffId)?.name;
}
