/**
 * PROTOTYPE DATA — mock records only.
 * Nothing here talks to a backend. The real HMS API/service layer replaces
 * this file plus `src/services/*` without touching any UI component.
 */

export type ComplaintStatus = "submitted" | "assigned" | "in_progress" | "resolved";

export type ComplaintCategory =
  | "Electrical"
  | "Plumbing"
  | "Furniture"
  | "Cleaning"
  | "Internet"
  | "Other";

export interface TimelineEntry {
  status: ComplaintStatus;
  at: string;
  note?: string;
}

export interface Complaint {
  id: string;
  room: string;
  floor: number;
  category: ComplaintCategory;
  title: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  studentEmail: string;
  studentName: string;
  assignedStaffId?: string;
  overdue?: boolean;
  hasMedia?: boolean;
  resolutionNote?: string;
  timeline: TimelineEntry[];
}

export interface StaffMember {
  id: string;
  name: string;
  trade: string;
  email: string;
}

export interface StudentProfile {
  email: string;
  fullName: string;
  prn: string;
  branch: string;
  joiningYear: string;
  rollNumber: string;
  division: string;
  academicYear: string;
  room: string;
}

export interface RoomRecord {
  number: string;
  floor: number;
  occupied: boolean;
  occupants: string[];
}

/** Fixed hostel structure: 90 rooms, floors 1-5, no blocks. */
export const FLOOR_PLAN: { floor: number; from: number; to: number }[] = [
  { floor: 1, from: 101, to: 120 },
  { floor: 2, from: 201, to: 220 },
  { floor: 3, from: 301, to: 320 },
  { floor: 4, from: 401, to: 420 },
  { floor: 5, from: 501, to: 510 },
];

const UNOCCUPIED = new Set([
  "118", "119", "120", "219", "220", "318", "319", "320", "417", "418", "419", "420", "509", "510",
]);

export const rooms: RoomRecord[] = FLOOR_PLAN.flatMap(({ floor, from, to }) => {
  const list: RoomRecord[] = [];
  for (let n = from; n <= to; n++) {
    const number = String(n);
    list.push({
      number,
      floor,
      occupied: !UNOCCUPIED.has(number),
      occupants: UNOCCUPIED.has(number) ? [] : ["Occupant A", "Occupant B"],
    });
  }
  return list;
});

export const staff: StaffMember[] = [
  { id: "s1", name: "Ramesh Pawar", trade: "Electrical", email: "ramesh.pawar@hostel.local" },
  { id: "s2", name: "Sunita Deshmukh", trade: "Plumbing", email: "sunita.deshmukh@hostel.local" },
  { id: "s3", name: "Imran Shaikh", trade: "Carpentry", email: "imran.shaikh@hostel.local" },
  { id: "s4", name: "Kavita More", trade: "Housekeeping", email: "kavita.more@hostel.local" },
  { id: "s5", name: "Prakash Jadhav", trade: "Networking", email: "prakash.jadhav@hostel.local" },
  { id: "s6", name: "Anil Gaikwad", trade: "General", email: "anil.gaikwad@hostel.local" },
];

/** The signed-in staff member for the prototype. */
export const CURRENT_STAFF_ID = "s1";

export const students: StudentProfile[] = [
  {
    email: "student@ms.pict.edu",
    fullName: "Antariksh Rajesh Kothari",
    prn: "f24ce307",
    branch: "CE",
    joiningYear: "2024",
    rollNumber: "24CE307",
    division: "CE-C",
    academicYear: "2025-26",
    room: "204",
  },
  {
    email: "meera.joshi@ms.pict.edu",
    fullName: "Meera Joshi",
    prn: "f24it112",
    branch: "IT",
    joiningYear: "2024",
    rollNumber: "24IT112",
    division: "IT-A",
    academicYear: "2025-26",
    room: "312",
  },
];

export const wardenProfile = {
  name: "Dr. S. R. Kulkarni",
  email: "warden@hostel.local",
  title: "Hostel Warden",
};

export const inchargeProfile = {
  name: "Prof. A. M. Bhosale",
  email: "incharge@hostel.local",
  title: "Hostel Incharge",
};

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

function line(status: ComplaintStatus, h: number, note?: string): TimelineEntry {
  return { status, at: hoursAgo(h), ...(note ? { note } : {}) };
}

export const complaints: Complaint[] = [
  {
    id: "CMP-1041",
    room: "204",
    floor: 2,
    category: "Plumbing",
    title: "Water leakage under the washbasin",
    description: "Water keeps dripping from the pipe below the washbasin and the floor stays wet.",
    status: "in_progress",
    createdAt: hoursAgo(30),
    updatedAt: hoursAgo(4),
    studentEmail: "student@ms.pict.edu",
    studentName: "Antariksh Rajesh Kothari",
    assignedStaffId: "s2",
    hasMedia: true,
    timeline: [line("submitted", 30), line("assigned", 26), line("in_progress", 4)],
  },
  {
    id: "CMP-1036",
    room: "204",
    floor: 2,
    category: "Electrical",
    title: "Ceiling fan not working",
    description: "The fan does not start even though the switch and regulator work for other points.",
    status: "resolved",
    createdAt: hoursAgo(120),
    updatedAt: hoursAgo(70),
    studentEmail: "student@ms.pict.edu",
    studentName: "Antariksh Rajesh Kothari",
    assignedStaffId: "s1",
    resolutionNote: "Capacitor replaced and fan tested.",
    timeline: [
      line("submitted", 120),
      line("assigned", 116),
      line("in_progress", 96),
      line("resolved", 70, "Capacitor replaced and fan tested."),
    ],
  },
  {
    id: "CMP-1050",
    room: "212",
    floor: 2,
    category: "Electrical",
    title: "Tube light flickering",
    description: "The tube light flickers continuously at night.",
    status: "assigned",
    createdAt: hoursAgo(20),
    updatedAt: hoursAgo(18),
    studentEmail: "rahul.k@ms.pict.edu",
    studentName: "Rahul Kadam",
    assignedStaffId: "s1",
    timeline: [line("submitted", 20), line("assigned", 18)],
  },
  {
    id: "CMP-1051",
    room: "207",
    floor: 2,
    category: "Electrical",
    title: "Socket not charging laptop",
    description: "Right-side wall socket has no power.",
    status: "in_progress",
    createdAt: hoursAgo(48),
    updatedAt: hoursAgo(6),
    studentEmail: "nikhil.p@ms.pict.edu",
    studentName: "Nikhil Patil",
    assignedStaffId: "s1",
    hasMedia: true,
    timeline: [line("submitted", 48), line("assigned", 44), line("in_progress", 6)],
  },
  {
    id: "CMP-1052",
    room: "215",
    floor: 2,
    category: "Plumbing",
    title: "Tap leaking in bathroom",
    description: "Tap keeps running even when closed fully.",
    status: "submitted",
    createdAt: hoursAgo(9),
    updatedAt: hoursAgo(9),
    studentEmail: "omkar.s@ms.pict.edu",
    studentName: "Omkar Sawant",
    timeline: [line("submitted", 9)],
  },
  {
    id: "CMP-1053",
    room: "203",
    floor: 2,
    category: "Furniture",
    title: "Study chair broken",
    description: "The backrest joint has come loose.",
    status: "assigned",
    createdAt: hoursAgo(75),
    updatedAt: hoursAgo(70),
    studentEmail: "sagar.b@ms.pict.edu",
    studentName: "Sagar Bhosale",
    assignedStaffId: "s3",
    overdue: true,
    timeline: [line("submitted", 75), line("assigned", 70)],
  },
  {
    id: "CMP-1054",
    room: "108",
    floor: 1,
    category: "Cleaning",
    title: "Corridor not cleaned",
    description: "Corridor outside the room has not been cleaned for two days.",
    status: "resolved",
    createdAt: hoursAgo(60),
    updatedAt: hoursAgo(40),
    studentEmail: "amit.r@ms.pict.edu",
    studentName: "Amit Rane",
    assignedStaffId: "s4",
    resolutionNote: "Corridor cleaned and added to daily round.",
    timeline: [
      line("submitted", 60),
      line("assigned", 56),
      line("in_progress", 50),
      line("resolved", 40, "Corridor cleaned and added to daily round."),
    ],
  },
  {
    id: "CMP-1055",
    room: "112",
    floor: 1,
    category: "Internet",
    title: "Wi-Fi keeps disconnecting",
    description: "Connection drops every few minutes in the evening.",
    status: "in_progress",
    createdAt: hoursAgo(28),
    updatedAt: hoursAgo(5),
    studentEmail: "tejas.m@ms.pict.edu",
    studentName: "Tejas Mane",
    assignedStaffId: "s5",
    timeline: [line("submitted", 28), line("assigned", 24), line("in_progress", 5)],
  },
  {
    id: "CMP-1056",
    room: "119",
    floor: 1,
    category: "Electrical",
    title: "Emergency light not charging",
    description: "Corridor emergency light stays off during power cuts.",
    status: "submitted",
    createdAt: hoursAgo(14),
    updatedAt: hoursAgo(14),
    studentEmail: "vivek.d@ms.pict.edu",
    studentName: "Vivek Dhage",
    timeline: [line("submitted", 14)],
  },
  {
    id: "CMP-1057",
    room: "305",
    floor: 3,
    category: "Plumbing",
    title: "Low water pressure",
    description: "Very little water in the bathroom during the morning.",
    status: "assigned",
    createdAt: hoursAgo(34),
    updatedAt: hoursAgo(30),
    studentEmail: "harsh.v@ms.pict.edu",
    studentName: "Harsh Vartak",
    assignedStaffId: "s2",
    timeline: [line("submitted", 34), line("assigned", 30)],
  },
  {
    id: "CMP-1058",
    room: "312",
    floor: 3,
    category: "Furniture",
    title: "Cupboard door does not close",
    description: "Hinge is bent and the door stays half open.",
    status: "submitted",
    createdAt: hoursAgo(7),
    updatedAt: hoursAgo(7),
    studentEmail: "meera.joshi@ms.pict.edu",
    studentName: "Meera Joshi",
    timeline: [line("submitted", 7)],
  },
  {
    id: "CMP-1059",
    room: "312",
    floor: 3,
    category: "Electrical",
    title: "Table lamp point dead",
    description: "The point near the study table has no supply.",
    status: "resolved",
    createdAt: hoursAgo(150),
    updatedAt: hoursAgo(130),
    studentEmail: "meera.joshi@ms.pict.edu",
    studentName: "Meera Joshi",
    assignedStaffId: "s1",
    resolutionNote: "Loose wiring re-terminated.",
    timeline: [
      line("submitted", 150),
      line("assigned", 146),
      line("in_progress", 140),
      line("resolved", 130, "Loose wiring re-terminated."),
    ],
  },
  {
    id: "CMP-1060",
    room: "317",
    floor: 3,
    category: "Cleaning",
    title: "Dustbin not collected",
    description: "Bin on the floor landing has been full since yesterday.",
    status: "in_progress",
    createdAt: hoursAgo(22),
    updatedAt: hoursAgo(3),
    studentEmail: "pooja.n@ms.pict.edu",
    studentName: "Pooja Nair",
    assignedStaffId: "s4",
    timeline: [line("submitted", 22), line("assigned", 20), line("in_progress", 3)],
  },
  {
    id: "CMP-1061",
    room: "402",
    floor: 4,
    category: "Plumbing",
    title: "Flush not working",
    description: "The flush tank does not refill.",
    status: "assigned",
    createdAt: hoursAgo(80),
    updatedAt: hoursAgo(76),
    studentEmail: "arjun.t@ms.pict.edu",
    studentName: "Arjun Tambe",
    assignedStaffId: "s2",
    overdue: true,
    hasMedia: true,
    timeline: [line("submitted", 80), line("assigned", 76)],
  },
  {
    id: "CMP-1062",
    room: "409",
    floor: 4,
    category: "Electrical",
    title: "Fan speed regulator faulty",
    description: "Fan runs at full speed on every setting.",
    status: "submitted",
    createdAt: hoursAgo(11),
    updatedAt: hoursAgo(11),
    studentEmail: "kiran.s@ms.pict.edu",
    studentName: "Kiran Sonawane",
    timeline: [line("submitted", 11)],
  },
  {
    id: "CMP-1063",
    room: "409",
    floor: 4,
    category: "Furniture",
    title: "Bed frame creaking",
    description: "Bolt on the frame is loose.",
    status: "resolved",
    createdAt: hoursAgo(200),
    updatedAt: hoursAgo(180),
    studentEmail: "kiran.s@ms.pict.edu",
    studentName: "Kiran Sonawane",
    assignedStaffId: "s3",
    resolutionNote: "Bolts tightened and frame checked.",
    timeline: [
      line("submitted", 200),
      line("assigned", 196),
      line("in_progress", 190),
      line("resolved", 180, "Bolts tightened and frame checked."),
    ],
  },
  {
    id: "CMP-1064",
    room: "414",
    floor: 4,
    category: "Internet",
    title: "LAN port not detected",
    description: "Wired port in the room shows no connection.",
    status: "in_progress",
    createdAt: hoursAgo(26),
    updatedAt: hoursAgo(2),
    studentEmail: "yash.g@ms.pict.edu",
    studentName: "Yash Gawade",
    assignedStaffId: "s5",
    timeline: [line("submitted", 26), line("assigned", 24), line("in_progress", 2)],
  },
  {
    id: "CMP-1065",
    room: "503",
    floor: 5,
    category: "Cleaning",
    title: "Washroom needs deep cleaning",
    description: "Common washroom on floor 5 needs a thorough clean.",
    status: "assigned",
    createdAt: hoursAgo(40),
    updatedAt: hoursAgo(36),
    studentEmail: "rohit.a@ms.pict.edu",
    studentName: "Rohit Ahire",
    assignedStaffId: "s4",
    timeline: [line("submitted", 40), line("assigned", 36)],
  },
  {
    id: "CMP-1066",
    room: "506",
    floor: 5,
    category: "Other",
    title: "Window latch broken",
    description: "Window does not stay shut in the wind.",
    status: "submitted",
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(5),
    studentEmail: "sahil.k@ms.pict.edu",
    studentName: "Sahil Khot",
    timeline: [line("submitted", 5)],
  },
  {
    id: "CMP-1067",
    room: "205",
    floor: 2,
    category: "Plumbing",
    title: "Drain blocked",
    description: "Bathroom drain is slow and water collects.",
    status: "assigned",
    createdAt: hoursAgo(90),
    updatedAt: hoursAgo(85),
    studentEmail: "aniket.j@ms.pict.edu",
    studentName: "Aniket Jagtap",
    assignedStaffId: "s2",
    overdue: true,
    timeline: [line("submitted", 90), line("assigned", 85)],
  },
  {
    id: "CMP-1068",
    room: "110",
    floor: 1,
    category: "Furniture",
    title: "Study table drawer stuck",
    description: "Drawer will not open at all.",
    status: "resolved",
    createdAt: hoursAgo(220),
    updatedAt: hoursAgo(205),
    studentEmail: "sameer.l@ms.pict.edu",
    studentName: "Sameer Lokhande",
    assignedStaffId: "s3",
    resolutionNote: "Runner realigned.",
    timeline: [
      line("submitted", 220),
      line("assigned", 215),
      line("in_progress", 210),
      line("resolved", 205, "Runner realigned."),
    ],
  },
  {
    id: "CMP-1069",
    room: "301",
    floor: 3,
    category: "Electrical",
    title: "Corridor light out",
    description: "Light near the staircase does not turn on.",
    status: "in_progress",
    createdAt: hoursAgo(19),
    updatedAt: hoursAgo(1),
    studentEmail: "gaurav.w@ms.pict.edu",
    studentName: "Gaurav Wagh",
    assignedStaffId: "s1",
    timeline: [line("submitted", 19), line("assigned", 16), line("in_progress", 1)],
  },
  {
    id: "CMP-1070",
    room: "418",
    floor: 4,
    category: "Other",
    title: "Room key duplicate needed",
    description: "Second key for the room is missing.",
    status: "submitted",
    createdAt: hoursAgo(3),
    updatedAt: hoursAgo(3),
    studentEmail: "farhan.q@ms.pict.edu",
    studentName: "Farhan Qureshi",
    timeline: [line("submitted", 3)],
  },
  {
    id: "CMP-1071",
    room: "208",
    floor: 2,
    category: "Cleaning",
    title: "Water cooler area dirty",
    description: "Spilled water around the cooler on floor 2.",
    status: "resolved",
    createdAt: hoursAgo(96),
    updatedAt: hoursAgo(88),
    studentEmail: "devang.p@ms.pict.edu",
    studentName: "Devang Pathak",
    assignedStaffId: "s4",
    resolutionNote: "Area cleaned and mat placed.",
    timeline: [
      line("submitted", 96),
      line("assigned", 94),
      line("in_progress", 92),
      line("resolved", 88, "Area cleaned and mat placed."),
    ],
  },
  {
    id: "CMP-1072",
    room: "216",
    floor: 2,
    category: "Electrical",
    title: "Switchboard sparking",
    description: "Small spark seen when plugging in a charger.",
    status: "assigned",
    createdAt: hoursAgo(12),
    updatedAt: hoursAgo(10),
    studentEmail: "ishan.b@ms.pict.edu",
    studentName: "Ishan Bagade",
    assignedStaffId: "s1",
    timeline: [line("submitted", 12), line("assigned", 10)],
  },
];
