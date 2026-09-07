import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/hms/app-shell";
import { useAuth } from "@/services/auth";

export const Route = createFileRoute("/student/profile")({
  head: () => ({
    meta: [
      { title: "My profile — Hostel Management System" },
      { name: "description", content: "Your hostel profile: PRN, branch, division, academic year and room." },
      { property: "og:title", content: "My profile — Hostel Management System" },
      { property: "og:description", content: "Your hostel profile and allotment details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StudentProfilePage,
});

function StudentProfilePage() {
  const { currentUser } = useAuth();
  const s = currentUser?.student;
  if (!s) return null;

  const rows: [string, string][] = [
    ["Full name", s.fullName],
    ["College email", s.email],
    ["PRN", s.prn],
    ["Branch", s.branch],
    ["Division", s.division],
    ["Roll number", s.rollNumber],
    ["Joining year", s.joiningYear],
    ["Academic year", s.academicYear],
    ["Room", s.room],
  ];

  return (
    <>
      <PageHeader title="Profile" description="Details shared with the hostel office." />
      <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="truncate text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
