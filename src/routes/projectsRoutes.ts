import { Router, Request, Response } from 'express';
import { prisma, logPrismaError } from '../db';
import { isNewData } from '../helpers/isNewDataPatched';
//TODO
// Delete project

const projectRouter = Router()

projectRouter.get('/', async (_req: Request, res: Response) => {
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
    const { title, company, body, role, skill, duration, expiresBy, likesCount, location, projectOwner } = req.body
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
                location,
                projectOwner: {connect: { companyEmail: projectOwner}}
            }
        })
        res.status(201).send({ success: true, postProject })
    } catch (error: any) {
        const isPrismaError = logPrismaError(error)
        res.status(404).send({ success: false, error: isPrismaError || error })
    }
});

projectRouter.put('/:id', async (req: Request, res: Response) => {
    const { body } = req
    try {
        const isUpdatedRequired = await isNewData(req, async (arg: any) => {
            return await prisma.project.findUnique({
                where: {
                    id: parseInt(req.params.id)
                },
                include: {
                    role: true,
                    skill: true
                }
            })
        })
        if (!isUpdatedRequired.isNewData) {
            return res.status(200).send({success: true, message: "Data is not new; no update required"})
        } else {
            const postProject = await prisma.project.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    title: body.title || undefined,
                    company: body.company || undefined,
                    body: body.body || undefined,
                    role: (!!body.role ? { connect: { role: body.role } } : undefined),
                    skill: (!!body.skill ? { connect: { skill: body.skill } } : undefined),
                    duration: body.duration || undefined,
                    expiresBy: body.expiresBy || undefined,
                    likesCount: body.likesCount || undefined,
                    location: body.location || undefined
                }
            })
            res.status(201).send({ success: true, postProject })
        }
    } catch (error: any) {
        const isPrismaError = logPrismaError(error)
        res.status(404).send({ success: false, error: isPrismaError || error })
    }
});


projectRouter.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const deleteOneProject = await prisma.project.delete({
            where: {
                id: parseInt(id)
            }
        })
        res.status(200).send({
            success: true,
            response: deleteOneProject,
            message: "Project deleted ID: " + id
        })
    } catch (error) {
        const isPrismaError = logPrismaError(error)
        res.status(404).send({ success: false, error: isPrismaError || error })
    }
});

export default projectRouter;