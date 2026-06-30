import { Router } from 'express'
import { login, changePassword, session } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const authRouter = Router()

authRouter.post('/login', login)
authRouter.get('/session', protect, session)
authRouter.put('/change-password', protect, changePassword)


export default authRouter