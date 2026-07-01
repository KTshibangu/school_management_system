import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import multer from 'multer'
import connectDB from './config/db.js'
import logger from './config/logger.js'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import teacherRouter from './routes/teacher.routes.js'
import profileRouter from './routes/profile.routes.js'
import subjectRouter from './routes/subject.routes.js'
import classRouter from './routes/class.routes.js'
import studentRouter from './routes/student.routes.js'
import eventRouter from './routes/event.routes.js'
import assessmentRouter from './routes/assessment.routes.js'

const app = express()
const PORT = process.env.PORT || 5000


//Middleware
app.use(cors())
app.use(express.json())
app.use(multer().none())
app.use(helmet())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined', {stream: {write: (message) => logger.info(message.trim())}}))
app.use(cookieParser())

//Routes 
app.get('/', (req, res) => {
    logger.info("Hello from School-Management")
    res.send("Server Running!")
})
app.use("/api/auth", authRouter)
app.use("/api/teachers", teacherRouter)
app.use("/api/profile", profileRouter)
app.use('/api/subjects', subjectRouter)
app.use('/api/classes', classRouter)
app.use('/api/students', studentRouter)
app.use('/api/events', eventRouter)
app.use('/api/assessments', assessmentRouter)

//DB Connection
await connectDB()

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))

