import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Event from "../models/Event.js";
import Assessment from "../models/Assessment.js";
import logger from "../config/logger.js";

export const getAdminDashboard = async () => {
    const [totalTeachers, totalStudents, totalClasses, totalSubjects] = await Promise.all([
        Teacher.countDocuments(),
        Student.countDocuments(),
        Class.countDocuments(),
        Subject.countDocuments(),
    ]);

    logger.info("Admin dashboard data fetched");
    return {
        role: "ADMIN",
        totalTeachers,
        totalStudents,
        totalClasses,
        totalSubjects,
    };
};

export const getTeacherDashboard = async (userId) => {
    const teacher = await Teacher.findOne({ userId }).lean();
    if (!teacher) throw new Error("Teacher not found");

    const teacherClassIds = teacher.classesAssigned;

    const [totalClasses, totalEvents, totalAssessments, totalStudents] = await Promise.all([
        teacherClassIds.length,
        Event.countDocuments({
            audience: { $in: ["ALL", "TEACHERS"] } // events relevant to this teacher
        }),
        Assessment.countDocuments({ createdBy: teacher._id }), // only their own assessments
        Student.countDocuments({ class: { $in: teacherClassIds } }), // students in their classes
    ]);

    logger.info(`Teacher dashboard data fetched for teacher ${teacher._id}`);
    return {
        role: "TEACHER",
        totalClasses,
        totalEvents,
        totalAssessments,
        totalStudents,
    };
};