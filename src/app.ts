import express, { Request, Response } from 'express';
import morganMiddleware from './middlewares/morganMiddleware';
import {credentials} from './middlewares/credentials'
import { corsOptions } from './config/corsOptions';
import { projectRouter, logoutRouter, authRouter, profileRouter, skillsRouter, usersRouter, companyRouter, rolesRouter } from './routes';
import dotenv from 'dotenv';
import passport from "passport";
import { LocalStrategy } from './authentication/localStrategy';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwtRouter from './routes/jwtRoutes';
import {verifyToken} from './middlewares/authenticationJwt';
import multer from 'multer'
import { uploadFile, getFileStream } from './config/s3';
import fs from 'fs';
import util from 'util'

const unlinkFile = util.promisify(fs.unlink)
export const upload = multer({dest:'uploads/'})

dotenv.config()

const app = express()
app.use(credentials)
app.use(cors(corsOptions))
// app.use(cors())
passport.use(LocalStrategy)
app.use(express.json())
app.use(cookieParser())
app.use(morganMiddleware)
app.use(passport.initialize());

app.use('/api/projects', projectRouter)
app.use('/api/auth', authRouter)
app.use('/api/token', jwtRouter)
app.use('/api/profile', profileRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/users', usersRouter)
app.use('/api/company', companyRouter)
app.use('/api/skills', skillsRouter)
app.use('/api/roles', rolesRouter)


app.get('/images/:key', (req, res) => {
    // console.log(req.params)
    const key = req.params.key
    const readStream = getFileStream(key)
    // console.log(readStream)
    readStream.pipe(res)
  })

app.post('/images', upload.single('file'), async (req: Request, res: Response) => {
    console.log(req.file)
    // console.log(req.body)
    const result = await uploadFile(req.file)
    //@ts-ignore
    await unlinkFile(req.file.path)
    console.log(result)
    const description = req.body.description
    res.send({imagePath: `/images/${result.Key}`})
  })

app.get('/', verifyToken, (req: Request, res: Response) => {
    res.status(200).send("Hello World!")
})

app.listen(process.env.PORT || 8080, () => {
    return console.log("App listening on port " + process.env.PORT, "- Enviroment: " + process.env.NODE_ENV)
})

process.on('SIGTERM', () => process.exit())