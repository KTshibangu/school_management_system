import { Router } from 'express'
import { deleteTeacherById, fetchAllTeachers, postTeacher, updateTeacherById } from '../controllers/teacher.controller.js'
import { protect, requireRole } from '../middleware/auth.middleware.js'

const teacherRouter = Router()

teacherRouter.use(protect, requireRole(["ADMIN"]))

teacherRouter.get('/', fetchAllTeachers)
teacherRouter.post('/', postTeacher)
teacherRouter.put('/:id', updateTeacherById)
teacherRouter.delete('/:id', deleteTeacherById)

export default teacherRouter