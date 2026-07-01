import Teacher from '../models/Teacher.js'
import Student from '../models/Student.js'
import Class from '../models/Class.js'
import Subject from '../models/Subject.js'


//GET dashboard for employee and admin
//GET /api/dashboard

export const getDashboard = async (req, res) => {
    try {
        const session = req.session
        const isAdmin = session.role === "ADMIN"

        if (isAdmin) {
            const [totalTeachers, totalStudents, totalClasses, totalSubjects] = await Promise.all([
                Teacher.countDocuments({isDeleted: {$ne : true}}),
                Student.countDocuments(),
                Class.countDocuments(),
                Subject.countDocuments()
            ])

            return res.json({
                role: "ADMIN",
                totalTeachers,
                totalStudents,
                totalClasses,
                totalSubjects
            })
        } else {
            const teacher = await Teacher.findOne({userId: session.userId}).lean()
            if(!teacher) return res.status(404).json({error: "Employee Not Found"})
        }
    } catch (error) {

    }
}