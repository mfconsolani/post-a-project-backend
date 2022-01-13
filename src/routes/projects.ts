import { Router, Request, Response } from 'express';
import { prisma, logPrismaError } from '../db';

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
    const { id } = req.params;
    try {
        const findOneProject = await prisma.project.findUnique(
            {
                where: {
                    id: parseInt(id)
                }
            }
        )
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
        res.status(200).send({success: true, postProject})
    } catch (error: any) {
        const isPrismaError = logPrismaError(error)
        res.status(404).send({ success: false, error: isPrismaError || error })
    }
});


