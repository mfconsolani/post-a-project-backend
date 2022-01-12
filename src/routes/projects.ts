import { Router, Request, Response } from 'express';
import { prisma, logPrismaError } from '../db';



export const projectRouter = Router()

projectRouter.get('/', async (req: Request, res: Response) => {
    try {
        const allProjects = await prisma.project.findMany()
        res.status(200).send(allProjects)
    } catch (error) {
        res.status(404).send(error)
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
        res.status(200).send(postProject)
    } catch (error: any) {
        const isPrismaError = logPrismaError(error)
        res.status(404).send({ success: false, error: isPrismaError || error })
    }
});


