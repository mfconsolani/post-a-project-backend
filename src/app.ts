import express, { Request, Response } from 'express';
import morganMiddleware from './middlewares/morganMiddleware';
import { projectRouter } from './routes/projects';
const app = express()

app.use(express.json())
app.use(morganMiddleware)
app.use('/api/projects', projectRouter)

const PORT: number = 8080

app.listen(PORT, () => {
    return console.log("App listening on port " + PORT, "- Enviroment: " + process.env.NODE_ENV)
    })

process.on('SIGTERM', () => process.exit())