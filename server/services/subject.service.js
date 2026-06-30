import mongoose from "mongoose";
import Subject from "../models/Subject.js";
import Teacher from "../models/Teacher.js";
import logger from "../config/logger.js";



// GET /api/subjects
export const getSubjects = async () => {
    const subjects = await Subject.find()
        .sort({ grade: 1, name: 1 })
        .lean();

    return subjects.map((subject) => ({
        ...subject,
        id: subject._id.toString(),
    }));
};

// GET /api/subjects/:id
export const getSubjectById = async (id) => {
    const subject = await Subject.findById(id).lean();
    if (!subject) throw new Error("Subject not found");

    return { ...subject, id: subject._id.toString() };
};

// POST /api/subjects
export const createSubject = async (data) => {
    const subject = await Subject.create(data);

    logger.info(`Subject ${subject.code} created successfully`);
    return subject;
};

// PUT /api/subjects/:id
export const updateSubject = async (id, data) => {
    const subject = await Subject.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
    );
    if (!subject) throw new Error("Subject not found");

    logger.info(`Subject ${subject.code} updated successfully`);
    return subject;
};

// DELETE /api/subjects/:id
export const deleteSubject = async (id) => {
    const subject = await Subject.findById(id);
    if (!subject) throw new Error("Subject not found");

    // guard: prevent deleting a subject that still has teachers assigned to it
    const assignedTeacher = await Teacher.findOne({ subject: id });
    if (assignedTeacher) throw new Error("Subject is assigned to one or more teachers");

    await Subject.findByIdAndDelete(id);

    logger.info(`Subject ${subject.code} deleted`);
};