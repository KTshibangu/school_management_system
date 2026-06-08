// ─────────────────────────────────────────────
//  SCHOOL MANAGEMENT SYSTEM — DUMMY ASSETS
// ─────────────────────────────────────────────

export const SUBJECTS = [
    "Mathematics",
    "English Language",
    "Physical Science",
    "Life Sciences",
    "Geography",
    "History",
    "Accounting",
    "Business Studies",
    "Computer Applications Technology",
    "Life Orientation",
];

export const GRADES = ["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

export const TERMS = ["Term 1", "Term 2", "Term 3", "Term 4"];

// ─────────────────────────────────────────────
//  DASHBOARD DATA
// ─────────────────────────────────────────────

export const dummyAdminDashboardData = {
    role: "ADMIN",
    totalTeachers: 12,
    totalStudents: 340,
    totalClasses: 18,
    pendingAssignments: 5,
    announcementsThisMonth: 8,
    todayAttendanceRate: 94, // percentage
};

export const dummyTeacherDashboardData = {
    role: "TEACHER",
    classesAssigned: 4,
    totalStudentsTaught: 120,
    pendingGrading: 3,
    announcementsPosted: 2,
    teacher: {
        firstName: "Sarah",
        lastName: "Nkosi",
        subject: "Mathematics",
        employeeCode: "TCH-2024-011",
    },
};

// ─────────────────────────────────────────────
//  PROFILE DATA
// ─────────────────────────────────────────────

export const dummyProfileData = {
    _id: "a1b2c3d4e5f6a7b8c9d0e1f2",
    firstName: "Sarah",
    lastName: "Nkosi",
    email: "sarah.nkosi@school.edu.za",
    image: null,
    role: "TEACHER",
};

// ─────────────────────────────────────────────
//  TEACHER DATA
// ─────────────────────────────────────────────

export const dummyTeacherData = [
    {
        _id: "t001a2b3c4d5e6f7a8b9c0d1",
        userId: {
            _id: "u001a2b3c4d5e6f7a8b9c0d1",
            email: "sarah.nkosi@school.edu.za",
            role: "TEACHER",
        },
        firstName: "Sarah",
        lastName: "Nkosi",
        email: "sarah.nkosi@school.edu.za",
        phone: "0821234567",
        subject: "Mathematics",
        employeeCode: "TCH-2024-011",
        classesAssigned: ["Grade 10A", "Grade 11B", "Grade 12A"],
        employmentStatus: "ACTIVE",
        joinDate: "2019-01-15T00:00:00.000Z",
        image: null,
        bio: "Passionate about making maths accessible to every learner.",
        isDeleted: false,
        createdAt: "2024-01-10T08:00:00.000Z",
        updatedAt: "2024-01-10T08:00:00.000Z",
    },
    {
        _id: "t002a2b3c4d5e6f7a8b9c0d2",
        userId: {
            _id: "u002a2b3c4d5e6f7a8b9c0d2",
            email: "james.dlamini@school.edu.za",
            role: "TEACHER",
        },
        firstName: "James",
        lastName: "Dlamini",
        email: "james.dlamini@school.edu.za",
        phone: "0839876543",
        subject: "Physical Science",
        employeeCode: "TCH-2022-007",
        classesAssigned: ["Grade 10B", "Grade 11A", "Grade 12B"],
        employmentStatus: "ACTIVE",
        joinDate: "2017-07-10T00:00:00.000Z",
        image: null,
        bio: "Physics and Chemistry enthusiast with 10+ years in education.",
        isDeleted: false,
        createdAt: "2024-01-10T08:00:00.000Z",
        updatedAt: "2024-01-10T08:00:00.000Z",
    },
    {
        _id: "t003a2b3c4d5e6f7a8b9c0d3",
        userId: {
            _id: "u003a2b3c4d5e6f7a8b9c0d3",
            email: "linda.van.der.berg@school.edu.za",
            role: "TEACHER",
        },
        firstName: "Linda",
        lastName: "Van Der Berg",
        email: "linda.van.der.berg@school.edu.za",
        phone: "0711122334",
        subject: "English Language",
        employeeCode: "TCH-2023-003",
        classesAssigned: ["Grade 8A", "Grade 9A", "Grade 10A"],
        employmentStatus: "ACTIVE",
        joinDate: "2020-02-03T00:00:00.000Z",
        image: null,
        bio: "Literature lover dedicated to nurturing strong communicators.",
        isDeleted: false,
        createdAt: "2024-01-10T08:00:00.000Z",
        updatedAt: "2024-01-10T08:00:00.000Z",
    },
];

// ─────────────────────────────────────────────
//  STUDENT DATA
// ─────────────────────────────────────────────

export const dummyStudentData = [
    {
        _id: "s001a2b3c4d5e6f7a8b9c0e1",
        firstName: "Liam",
        lastName: "Botha",
        email: "liam.botha@student.school.edu.za",
        studentNumber: "STU-2024-0041",
        grade: "Grade 10",
        className: "Grade 10A",
        phone: "0800000001",
        image: null,
        enrollmentStatus: "ACTIVE",
        joinDate: "2022-01-12T00:00:00.000Z",
        isDeleted: false,
        createdAt: "2024-01-10T08:00:00.000Z",
        updatedAt: "2024-01-10T08:00:00.000Z",
    },
    {
        _id: "s002a2b3c4d5e6f7a8b9c0e2",
        firstName: "Amara",
        lastName: "Osei",
        email: "amara.osei@student.school.edu.za",
        studentNumber: "STU-2024-0042",
        grade: "Grade 11",
        className: "Grade 11B",
        phone: "0800000002",
        image: null,
        enrollmentStatus: "ACTIVE",
        joinDate: "2021-01-15T00:00:00.000Z",
        isDeleted: false,
        createdAt: "2024-01-10T08:00:00.000Z",
        updatedAt: "2024-01-10T08:00:00.000Z",
    },
    {
        _id: "s003a2b3c4d5e6f7a8b9c0e3",
        firstName: "Ethan",
        lastName: "Pillay",
        email: "ethan.pillay@student.school.edu.za",
        studentNumber: "STU-2024-0043",
        grade: "Grade 12",
        className: "Grade 12A",
        phone: "0800000003",
        image: null,
        enrollmentStatus: "ACTIVE",
        joinDate: "2020-01-20T00:00:00.000Z",
        isDeleted: false,
        createdAt: "2024-01-10T08:00:00.000Z",
        updatedAt: "2024-01-10T08:00:00.000Z",
    },
];

// ─────────────────────────────────────────────
//  ATTENDANCE DATA
// ─────────────────────────────────────────────

export const dummyAttendanceData = [
    {
        _id: "att001a2b3c4d5e6f7a8b9c",
        studentId: "s001a2b3c4d5e6f7a8b9c0e1",
        className: "Grade 10A",
        subject: "Mathematics",
        date: "2026-06-05T00:00:00.000Z",
        status: "PRESENT",
        recordedBy: "t001a2b3c4d5e6f7a8b9c0d1",
        createdAt: "2026-06-05T07:45:00.000Z",
        updatedAt: "2026-06-05T07:45:00.000Z",
        student: dummyStudentData[0],
    },
    {
        _id: "att002a2b3c4d5e6f7a8b9c",
        studentId: "s002a2b3c4d5e6f7a8b9c0e2",
        className: "Grade 11B",
        subject: "Mathematics",
        date: "2026-06-05T00:00:00.000Z",
        status: "ABSENT",
        recordedBy: "t001a2b3c4d5e6f7a8b9c0d1",
        createdAt: "2026-06-05T07:45:00.000Z",
        updatedAt: "2026-06-05T07:45:00.000Z",
        student: dummyStudentData[1],
    },
    {
        _id: "att003a2b3c4d5e6f7a8b9c",
        studentId: "s003a2b3c4d5e6f7a8b9c0e3",
        className: "Grade 12A",
        subject: "Mathematics",
        date: "2026-06-04T00:00:00.000Z",
        status: "LATE",
        recordedBy: "t001a2b3c4d5e6f7a8b9c0d1",
        createdAt: "2026-06-04T07:50:00.000Z",
        updatedAt: "2026-06-04T07:50:00.000Z",
        student: dummyStudentData[2],
    },
    {
        _id: "att004a2b3c4d5e6f7a8b9c",
        studentId: "s001a2b3c4d5e6f7a8b9c0e1",
        className: "Grade 10A",
        subject: "Mathematics",
        date: "2026-06-04T00:00:00.000Z",
        status: "PRESENT",
        recordedBy: "t001a2b3c4d5e6f7a8b9c0d1",
        createdAt: "2026-06-04T07:45:00.000Z",
        updatedAt: "2026-06-04T07:45:00.000Z",
        student: dummyStudentData[0],
    },
];

// ─────────────────────────────────────────────
//  GRADES / RESULTS DATA
// ─────────────────────────────────────────────

export const dummyGradeData = [
    {
        _id: "gr001a2b3c4d5e6f7a8b9c0",
        studentId: "s001a2b3c4d5e6f7a8b9c0e1",
        subject: "Mathematics",
        term: "Term 1",
        year: 2026,
        assessmentType: "TEST",
        totalMarks: 100,
        marksObtained: 78,
        percentage: 78,
        grade: "B",
        gradedBy: "t001a2b3c4d5e6f7a8b9c0d1",
        createdAt: "2026-03-20T09:00:00.000Z",
        updatedAt: "2026-03-20T09:00:00.000Z",
        student: dummyStudentData[0],
    },
    {
        _id: "gr002a2b3c4d5e6f7a8b9c0",
        studentId: "s002a2b3c4d5e6f7a8b9c0e2",
        subject: "Mathematics",
        term: "Term 1",
        year: 2026,
        assessmentType: "EXAM",
        totalMarks: 150,
        marksObtained: 132,
        percentage: 88,
        grade: "A",
        gradedBy: "t001a2b3c4d5e6f7a8b9c0d1",
        createdAt: "2026-03-21T09:00:00.000Z",
        updatedAt: "2026-03-21T09:00:00.000Z",
        student: dummyStudentData[1],
    },
    {
        _id: "gr003a2b3c4d5e6f7a8b9c0",
        studentId: "s003a2b3c4d5e6f7a8b9c0e3",
        subject: "Physical Science",
        term: "Term 1",
        year: 2026,
        assessmentType: "ASSIGNMENT",
        totalMarks: 50,
        marksObtained: 31,
        percentage: 62,
        grade: "C",
        gradedBy: "t002a2b3c4d5e6f7a8b9c0d2",
        createdAt: "2026-03-22T09:00:00.000Z",
        updatedAt: "2026-03-22T09:00:00.000Z",
        student: dummyStudentData[2],
    },
    {
        _id: "gr004a2b3c4d5e6f7a8b9c0",
        studentId: "s001a2b3c4d5e6f7a8b9c0e1",
        subject: "English Language",
        term: "Term 2",
        year: 2026,
        assessmentType: "TEST",
        totalMarks: 80,
        marksObtained: 55,
        percentage: 68.75,
        grade: "C",
        gradedBy: "t003a2b3c4d5e6f7a8b9c0d3",
        createdAt: "2026-06-01T09:00:00.000Z",
        updatedAt: "2026-06-01T09:00:00.000Z",
        student: dummyStudentData[0],
    },
];

// ─────────────────────────────────────────────
//  ASSIGNMENT DATA
// ─────────────────────────────────────────────

export const dummyAssignmentData = [
    {
        _id: "as001a2b3c4d5e6f7a8b9c0",
        title: "Algebra Problem Set — Chapter 5",
        subject: "Mathematics",
        className: "Grade 10A",
        description: "Complete all exercises on quadratic equations from Chapter 5. Show all working.",
        dueDate: "2026-06-15T23:59:00.000Z",
        totalMarks: 50,
        status: "ACTIVE",
        attachmentUrl: null,
        createdBy: "t001a2b3c4d5e6f7a8b9c0d1",
        createdAt: "2026-06-05T08:00:00.000Z",
        updatedAt: "2026-06-05T08:00:00.000Z",
        teacher: dummyTeacherData[0],
        submissionsCount: 18,
        totalStudents: 25,
    },
    {
        _id: "as002a2b3c4d5e6f7a8b9c0",
        title: "Newton's Laws — Lab Report",
        subject: "Physical Science",
        className: "Grade 11A",
        description: "Write a lab report based on the pendulum experiment conducted in class. Include hypothesis, method, results, and conclusion.",
        dueDate: "2026-06-12T23:59:00.000Z",
        totalMarks: 30,
        status: "ACTIVE",
        attachmentUrl: null,
        createdBy: "t002a2b3c4d5e6f7a8b9c0d2",
        createdAt: "2026-06-03T08:00:00.000Z",
        updatedAt: "2026-06-03T08:00:00.000Z",
        teacher: dummyTeacherData[1],
        submissionsCount: 22,
        totalStudents: 28,
    },
    {
        _id: "as003a2b3c4d5e6f7a8b9c0",
        title: "Shakespearean Sonnet Analysis",
        subject: "English Language",
        className: "Grade 10A",
        description: "Analyse the structure, tone, and themes of Shakespeare's Sonnet 18. Minimum 600 words.",
        dueDate: "2026-06-10T23:59:00.000Z",
        totalMarks: 40,
        status: "GRADED",
        attachmentUrl: null,
        createdBy: "t003a2b3c4d5e6f7a8b9c0d3",
        createdAt: "2026-05-28T08:00:00.000Z",
        updatedAt: "2026-06-05T10:00:00.000Z",
        teacher: dummyTeacherData[2],
        submissionsCount: 25,
        totalStudents: 25,
    },
    {
        _id: "as004a2b3c4d5e6f7a8b9c0",
        title: "Term 2 Exam Revision Pack",
        subject: "Mathematics",
        className: "Grade 12A",
        description: "Complete the revision exercises covering calculus, probability, and statistics in preparation for the Term 2 exam.",
        dueDate: "2026-06-20T23:59:00.000Z",
        totalMarks: 100,
        status: "ACTIVE",
        attachmentUrl: null,
        createdBy: "t001a2b3c4d5e6f7a8b9c0d1",
        createdAt: "2026-06-06T08:00:00.000Z",
        updatedAt: "2026-06-06T08:00:00.000Z",
        teacher: dummyTeacherData[0],
        submissionsCount: 5,
        totalStudents: 30,
    },
];

// ─────────────────────────────────────────────
//  ANNOUNCEMENT DATA
// ─────────────────────────────────────────────

export const dummyAnnouncementData = [
    {
        _id: "an001a2b3c4d5e6f7a8b9c0",
        title: "Term 2 Examination Timetable Released",
        body: "The Term 2 examination timetable has been finalised and is available on the school notice board and the portal. All students are urged to take note of their exam dates and prepare accordingly.",
        audience: "ALL",         // ALL | TEACHERS | GRADE (specific)
        targetGrade: null,
        priority: "HIGH",
        postedBy: "a001a2b3c4d5e6f7a8b9c0", // admin id
        createdAt: "2026-06-06T07:30:00.000Z",
        updatedAt: "2026-06-06T07:30:00.000Z",
    },
    {
        _id: "an002a2b3c4d5e6f7a8b9c0",
        title: "Staff Meeting — Wednesday 11 June",
        body: "A compulsory staff meeting will be held on Wednesday, 11 June at 14:00 in the main staffroom. All teaching and administrative staff are required to attend. Apologies must be submitted to the principal's office by Tuesday.",
        audience: "TEACHERS",
        targetGrade: null,
        priority: "MEDIUM",
        postedBy: "a001a2b3c4d5e6f7a8b9c0",
        createdAt: "2026-06-05T09:00:00.000Z",
        updatedAt: "2026-06-05T09:00:00.000Z",
    },
    {
        _id: "an003a2b3c4d5e6f7a8b9c0",
        title: "Grade 12 Study Camp Registration Open",
        body: "Registration for the Grade 12 Winter Study Camp (28–30 June) is now open. Limited spaces are available. Students must collect and return consent forms from the admin office by 16 June.",
        audience: "GRADE",
        targetGrade: "Grade 12",
        priority: "MEDIUM",
        postedBy: "a001a2b3c4d5e6f7a8b9c0",
        createdAt: "2026-06-04T10:00:00.000Z",
        updatedAt: "2026-06-04T10:00:00.000Z",
    },
    {
        _id: "an004a2b3c4d5e6f7a8b9c0",
        title: "School Closed — Public Holiday (16 June)",
        body: "Please be reminded that the school will be closed on Monday, 16 June 2026 in observance of Youth Day. Normal school activities resume on Tuesday, 17 June.",
        audience: "ALL",
        targetGrade: null,
        priority: "LOW",
        postedBy: "a001a2b3c4d5e6f7a8b9c0",
        createdAt: "2026-06-03T08:00:00.000Z",
        updatedAt: "2026-06-03T08:00:00.000Z",
    },
];

// ─────────────────────────────────────────────
//  HELPER FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Returns a badge class and label for an attendance status.
 */
export function getAttendanceStatusDisplay(status) {
    const map = {
        PRESENT: { label: "Present", className: "badge-success" },
        ABSENT: { label: "Absent", className: "badge-danger" },
        LATE: { label: "Late", className: "badge-warning" },
        EXCUSED: { label: "Excused", className: "bg-blue-100 text-blue-700" },
    };
    return map[status] || { label: status, className: "bg-slate-100 text-slate-600" };
}

/**
 * Converts a numeric percentage into a letter grade and badge class.
 */
export function getGradeDisplay(percentage) {
    if (percentage >= 80) return { grade: "A", className: "badge-success" };
    if (percentage >= 70) return { grade: "B", className: "bg-blue-100 text-blue-700" };
    if (percentage >= 60) return { grade: "C", className: "badge-warning" };
    if (percentage >= 50) return { grade: "D", className: "bg-orange-100 text-orange-700" };
    return { grade: "F", className: "badge-danger" };
}

/**
 * Returns a badge class and label for an assignment status.
 */
export function getAssignmentStatusDisplay(status) {
    const map = {
        ACTIVE: { label: "Active", className: "bg-indigo-100 text-indigo-700" },
        GRADED: { label: "Graded", className: "badge-success" },
        CLOSED: { label: "Closed", className: "bg-slate-100 text-slate-600" },
        DRAFT: { label: "Draft", className: "badge-warning" },
    };
    return map[status] || { label: status, className: "bg-slate-100 text-slate-600" };
}

/**
 * Returns a badge class and label for an announcement priority.
 */
export function getAnnouncementPriorityDisplay(priority) {
    const map = {
        HIGH: { label: "High Priority", className: "badge-danger" },
        MEDIUM: { label: "Medium Priority", className: "badge-warning" },
        LOW: { label: "Low Priority", className: "bg-slate-100 text-slate-600" },
    };
    return map[priority] || { label: priority, className: "bg-slate-100 text-slate-600" };
}

/**
 * Returns a human-readable submission progress string for an assignment.
 * e.g. "18 / 25 submitted"
 */
export function getSubmissionProgress(assignment) {
    const { submissionsCount, totalStudents } = assignment;
    if (submissionsCount == null || totalStudents == null) return "—";
    const percent = Math.round((submissionsCount / totalStudents) * 100);
    return {
        label: `${submissionsCount} / ${totalStudents} submitted`,
        percent,
    };
}

/**
 * Formats a date string to a readable short date.
 * e.g. "15 Jun 2026"
 */
export function formatDate(dateString) {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}