import express, { Request, Response } from 'express';
import morganMiddleware from './middlewares/morganMiddleware';
import { projectRouter, authRouter, profileRouter, skillsRouter, usersRouter, companyRouter, rolesRouter } from './routes';
import dotenv from 'dotenv';
import passport from "passport";
import { LocalStrategy } from './authentication/localStrategy';
import cors from 'cors'


dotenv.config()

const app = express()
app.use(cors())
passport.use(LocalStrategy)
app.use(express.json())
app.use(morganMiddleware)
app.use(passport.initialize());

app.use('/api/projects', projectRouter)
app.use('/api/auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/users', usersRouter)
app.use('/api/company', companyRouter)
app.use('/api/skills', skillsRouter)
app.use('/api/roles', rolesRouter)

app.get('/', (req: Request, res: Response) => {
    res.status(200).send("Hello World!")
})

app.listen(process.env.PORT || 8080, () => {
    return console.log("App listening on port " + process.env.PORT, "- Enviroment: " + process.env.NODE_ENV)
})

process.on('SIGTERM', () => process.exit())