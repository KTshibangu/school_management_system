import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Teacher from "../models/Teacher.js";
import logger from "../config/logger.js";

// Throws if any of the given subject ids don't exist
const assertSubjectsExist = async (subjectIds) => {
    if (!subjectIds || subjectIds.length === 0) return;

    const count = await Subject.countDocuments({ _id: { $in: subjectIds } });
    if (count !== subjectIds.length) throw new Error("One or more subjects not found");
};

// GET /api/classes
export const getClasses = async () => {
    const classes = await Class.find()
        .sort({ grade: 1, name: 1 })
        .populate("classSubjects", "name code")
        .lean();

    return classes.map((cls) => ({
        ...cls,
        id: cls._id.toString(),
    }));
};

// GET /api/classes/:id
export const getClassById = async (id) => {
    const cls = await Class.findById(id)
        .populate("classSubjects", "name code")
        .lean();
    if (!cls) throw new Error("Class not found");

    return { ...cls, id: cls._id.toString() };
};

// POST /api/classes
export const createClass = async (data) => {
    const { name, grade, classSubjects } = data;

    await assertSubjectsExist(classSubjects);

    const cls = await Class.create({ name, grade, classSubjects: classSubjects || [] });

    logger.info(`Class ${cls.name} (grade ${cls.grade}) created successfully`);
    return cls;
};

// PUT /api/classes/:id
export const updateClass = async (id, data) => {
    const { name, grade, classSubjects } = data;

    const cls = await Class.findById(id);
    if (!cls) throw new Error("Class not found");

    await assertSubjectsExist(classSubjects);

    const updatedClass = await Class.findByIdAndUpdate(
        id,
        {
            ...(name            !== undefined && { name }),
            ...(grade           !== undefined && { grade }),
            ...(classSubjects   !== undefined && { classSubjects }),
        },
        { new: true, runValidators: true }
    );

    logger.info(`Class ${updatedClass.name} updated successfully`);
    return updatedClass;
};

// DELETE /api/classes/:id
export const deleteClass = async (id) => {
    const cls = await Class.findById(id);
    if (!cls) throw new Error("Class not found");

    // guard: prevent deleting a class that still has teachers assigned to it
    const assignedTeacher = await Teacher.findOne({ classesAssigned: id });
    if (assignedTeacher) throw new Error("Class is assigned to one or more teachers");

    await Class.findByIdAndDelete(id);

    logger.info(`Class ${cls.name} (grade ${cls.grade}) deleted`);
};