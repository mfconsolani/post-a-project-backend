import express from 'express';
import morganMiddleware from './middlewares/morganMiddleware';
import { projectRouter, authRouter } from './routes';
import dotenv from 'dotenv';
import passport from "passport";

dotenv.config()

// require('dotenv').config()

const app = express()

app.use(express.json())
app.use(morganMiddleware)
app.use(passport.initialize());
// app.use(passport.session());

app.use('/api/projects', projectRouter)
app.use('/api/auth', authRouter)


app.listen(process.env.PORT || 8080, () => {
    return console.log("App listening on port " + process.env.PORT, "- Enviroment: " + process.env.NODE_ENV)
    })

process.on('SIGTERM', () => process.exit())