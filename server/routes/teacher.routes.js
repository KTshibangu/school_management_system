import { Router } from 'express'
import { deleteTeacherById, fetchAllTeachers, postTeacher, updateTeacherById } from '../controllers/teacher.controller.js'

const teacherRouter = Router()

teacherRouter.get('/', fetchAllTeachers)
teacherRouter.post('/', postTeacher)
teacherRouter.put('/:id', updateTeacherById)
teacherRouter.delete('/:id', deleteTeacherById)