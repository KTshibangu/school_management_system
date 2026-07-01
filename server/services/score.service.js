import Score from "../models/Score.js";
import Assessment from "../models/Assessment.js";
import Student from "../models/Student.js";
import Class from "../models/Class.js";
import logger from "../config/logger.js";

const assertReferencesExist = async ({ classId, assessmentId, studentId }) => {
    const [classExists, assessmentExists, studentExists] = await Promise.all([
        classId      ? Class.exists({ _id: classId })           : true,
        assessmentId ? Assessment.exists({ _id: assessmentId }) : true,
        studentId    ? Student.exists({ _id: studentId })       : true,
    ]);

    if (!classExists)      throw new Error("Class not found");
    if (!assessmentExists) throw new Error("Assessment not found");
    if (!studentExists)    throw new Error("Student not found");
};

// GET /api/scores
export const getScores = async (teacherId) => {
    const scores = await Score.find({ gradedBy: teacherId })
        .sort({ createdAt: -1 })
        .populate("student", "firstName lastName")
        .populate("class", "name grade")
        .populate("assessment", "title type term")
        .lean();

    return scores.map((score) => ({
        ...score,
        id: score._id.toString(),
    }));
};

// GET /api/scores/:id
export const getScoreById = async (id, teacherId) => {
    const score = await Score.findById(id)
        .populate("student", "firstName lastName")
        .populate("class", "name grade")
        .populate("assessment", "title type term")
        .lean();

    if (!score) throw new Error("Score not found");

    if (score.gradedBy.toString() !== teacherId) {
        throw new Error("Access denied");
    }

    return { ...score, id: score._id.toString() };
};

// POST /api/scores
export const createScore = async (data, teacherId) => {
    const { gradeLevel, student, class: classId, assessment, score, maxScore, remarks } = data;

    await assertReferencesExist({ classId, assessmentId: assessment, studentId: student });

    if (score > maxScore) throw new Error("Score cannot exceed max score");

    const newScore = await Score.create({
        gradeLevel,
        student,
        class: classId,
        assessment,
        score,
        maxScore,
        remarks: remarks || "",
        gradedBy: teacherId,
    });

    logger.info(`Score created for student ${student} by teacher ${teacherId}`);
    return newScore;
};

// PUT /api/scores/:id
export const updateScore = async (id, data, teacherId) => {
    const score = await Score.findById(id);
    if (!score) throw new Error("Score not found");

    if (score.gradedBy.toString() !== teacherId) {
        throw new Error("Access denied");
    }

    const { gradeLevel, student, class: classId, assessment, score: incomingScore, maxScore, remarks } = data;

    await assertReferencesExist({
        classId,
        assessmentId: assessment,
        studentId: student,
    });

    const resolvedScore = incomingScore ?? score.score;
    const resolvedMaxScore = maxScore ?? score.maxScore;
    if (resolvedScore > resolvedMaxScore) throw new Error("Score cannot exceed max score");

    const updatedScore = await Score.findByIdAndUpdate(
        id,
        {
            ...(gradeLevel !== undefined && { gradeLevel }),
            ...(student !== undefined && { student }),
            ...(classId !== undefined && { class: classId }),
            ...(assessment !== undefined && { assessment }),
            ...(incomingScore !== undefined && { score: incomingScore }),
            ...(maxScore !== undefined && { maxScore }),
            ...(remarks !== undefined && { remarks }),
        },
        { new: true, runValidators: true }
    );

    logger.info(`Score ${id} updated by teacher ${teacherId}`);
    return updatedScore;
};

// DELETE /api/scores/:id
export const deleteScore = async (id, teacherId) => {
    const score = await Score.findById(id);
    if (!score) throw new Error("Score not found");

    if (score.gradedBy.toString() !== teacherId) {
        throw new Error("Access denied");
    }

    await Score.findByIdAndDelete(id);

    logger.info(`Score ${id} deleted by teacher ${teacherId}`);
};