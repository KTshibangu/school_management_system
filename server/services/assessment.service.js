import Assessment from "../models/Assessment.js";
import Class from "../models/Class.js";
import logger from "../config/logger.js";

const assertClassExists = async (classId) => {
    const exists = await Class.exists({ _id: classId });
    if (!exists) throw new Error("Class not found");
};

// GET /api/assessments
// teachers only see assessments they created
export const getAssessments = async (teacherId) => {
    const assessments = await Assessment.find({ createdBy: teacherId })
        .sort({ dueDate: 1 })
        .populate("class", "name grade")
        .lean();

    return assessments.map((assessment) => ({
        ...assessment,
        id: assessment._id.toString(),
    }));
};

// GET /api/assessments/:id
export const getAssessmentById = async (id, teacherId) => {
    const assessment = await Assessment.findById(id)
        .populate("class", "name grade")
        .lean();

    if (!assessment) throw new Error("Assessment not found");

    // teachers can only view their own assessments
    if (assessment.createdBy.toString() !== teacherId) {
        throw new Error("Access denied");
    }

    return { ...assessment, id: assessment._id.toString() };
};

// POST /api/assessments
export const createAssessment = async (data, teacherId) => {
    const { title, description, type, term, class: classId, dueDate, maxScore } = data;

    await assertClassExists(classId);

    const assessment = await Assessment.create({
        title,
        description,
        type,
        term,
        class: classId,
        createdBy: teacherId,
        dueDate,
        maxScore,
    });

    logger.info(`Assessment "${assessment.title}" created by teacher ${teacherId}`);
    return assessment;
};

// PUT /api/assessments/:id
export const updateAssessment = async (id, data, teacherId) => {
    const assessment = await Assessment.findById(id);
    if (!assessment) throw new Error("Assessment not found");

    // teachers can only edit their own assessments
    if (assessment.createdBy.toString() !== teacherId) {
        throw new Error("Access denied");
    }

    if (data.class !== undefined) await assertClassExists(data.class);

    const { title, description, type, term, class: classId, dueDate, maxScore } = data;

    const updatedAssessment = await Assessment.findByIdAndUpdate(
        id,
        {
            ...(title       !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(type        !== undefined && { type }),
            ...(term        !== undefined && { term }),
            ...(classId     !== undefined && { class: classId }),
            ...(dueDate     !== undefined && { dueDate }),
            ...(maxScore    !== undefined && { maxScore }),
        },
        { new: true, runValidators: true }
    );

    logger.info(`Assessment "${updatedAssessment.title}" updated by teacher ${teacherId}`);
    return updatedAssessment;
};

// DELETE /api/assessments/:id
export const deleteAssessment = async (id, teacherId) => {
    const assessment = await Assessment.findById(id);
    if (!assessment) throw new Error("Assessment not found");

    // teachers can only delete their own assessments
    if (assessment.createdBy.toString() !== teacherId) {
        throw new Error("Access denied");
    }

    await Assessment.findByIdAndDelete(id);

    logger.info(`Assessment "${assessment.title}" deleted by teacher ${teacherId}`);
};