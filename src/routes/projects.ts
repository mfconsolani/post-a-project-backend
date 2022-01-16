import { Router, Request, Response } from 'express';
import { prisma, logPrismaError } from '../db';
import isNewData from '../helpers/isNewData';
import Logger from '../middlewares/winstonLoggerMiddleware';

//TODO
//Isolate the isUpdateRequired function to be a helper and enable to be used globally in the app.
//Create gist with isUpdatedRequired function snippet
export const projectRouter = Router()

projectRouter.get('/', async (req: Request, res: Response) => {
    try {
        const findAllProjects = await prisma.project.findMany()
        res.status(200).send({ success: true, response: findAllProjects })
    } catch (error) {
        const isPrismaError = logPrismaError(error)
        res.status(404).send({ success: false, error: isPrismaError || error })
    }
});

projectRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const findOneProject = await prisma.project.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                role: true,
                skill: true
            }
        })
        res.status(200).send({ success: true, response: findOneProject })
    } catch (error) {
        const isPrismaError = logPrismaError(error)
        res.status(404).send({ success: false, error: isPrismaError || error })
    }
});

projectRouter.post('/', async (req: Request, res: Response) => {
    const { title, company, body, role, skill, duration, expiresBy, likesCount, location } = req.body
    try {
        const postProject = await prisma.project.create({
            data: {
                title,
                company,
                body,
                role: { connect: { role } },
                skill: { connect: { skill } },
                duration,
                expiresBy,
                likesCount,
                location
            }
        })
        res.status(200).send({ success: true, postProject })
    } catch (error: any) {
        const isPrismaError = logPrismaError(error)
        res.status(404).send({ success: false, error: isPrismaError || error })
    }
});

projectRouter.put('/:id', async (req: Request, res: Response) => {
    const { title, company, body, role, skill, duration, expiresBy, likesCount, location } = req.body

    try {
        const isUpdatedRequired = await isNewData(req)
        if (!isUpdatedRequired.isNewData){
            console.log(isUpdatedRequired)
            return res.status(200).send("Data is not new")
        } else {
            const postProject = await prisma.project.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    title: title || undefined,
                    company: company || undefined,
                    body: body || undefined,
                    role: (!!role ? { connect: { role: role } } : undefined),
                    skill: (!!skill ? { connect: { skill: skill } } : undefined),
                    duration: duration || undefined,
                    expiresBy: expiresBy || undefined,
                    likesCount: likesCount || undefined,
                    location: location || undefined
                }
            })
            res.status(200).send({ success: true, postProject })
        }
    } catch (error: any) {
        const isPrismaError = logPrismaError(error)
        console.log(error)
        res.status(404).send({ success: false, error: isPrismaError || error })
    }
});