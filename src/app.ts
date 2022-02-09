import express from 'express';
import morganMiddleware from './middlewares/morganMiddleware';
import { projectRouter, authRouter, profileRouter, usersRouter, companyRouter } from './routes';
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


app.listen(process.env.PORT || 8080, () => {
    return console.log("App listening on port " + process.env.PORT, "- Enviroment: " + process.env.NODE_ENV)
})

process.on('SIGTERM', () => process.exit())