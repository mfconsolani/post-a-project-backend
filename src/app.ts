import express, { Request, Response } from 'express';
import morganMiddleware from './middlewares/morganMiddleware';
import { projectRouter } from './routes/projects';
import dotenv from 'dotenv';

dotenv.config()

// require('dotenv').config()

const app = express()

app.use(express.json())
app.use(morganMiddleware)
app.use('/api/projects', projectRouter)

// const PORT: number = 8080

app.listen(process.env.PORT, () => {
    return console.log("App listening on port " + process.env.PORT, "- Enviroment: " + process.env.NODE_ENV)
    })

process.on('SIGTERM', () => process.exit())