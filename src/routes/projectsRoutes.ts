import { Router, Request, Response } from 'express';
import { prisma, logPrismaError } from '../db';
import { isNewData } from '../helpers/isNewData';
//TODO
// Delete project

const projectRouter = Router()

projectRouter.get('/', async (_req: Request, res: Response) => {
    try {
        const findAllProjects = await prisma.project.findMany({
            include: {
                skill: true,
                role: true
            }
        })
        res.status(200).send({ success: true, data: findAllProjects })
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
        if (!findOneProject){
            res.status(200).send({ success: false, message: "Project doesn't exists" })
        } else {
            res.status(200).send({ success: true, message: "Project found", payload: findOneProject })
        }
    } catch (error) {
        const isPrismaError = logPrismaError(error)
        res.status(404).send({ success: false, error: isPrismaError || error })
    }
});

//TODO
//After modifying the database schemas, project put is no recognizing duplicates. Fix that shit

//Publish a brand new project
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
                likesCount: 0,
                // likesRegistered: undefined,
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


//TODO
// Implement the same logic for roles as in with skills to check if update is required and update it if
// it comes to it
// This endpoint should only be available for COMPANY profile types and checking id in request previously
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
                    skill: (!!body.skill ? { connect: body.skill.map((elem:any) => {return {skill: elem }}) } : undefined),
                    duration: body.duration || undefined,
                    expiresBy: body.expiresBy || undefined,
                    likesCount: body.likesCount || undefined,
                    // likesRegistered: body.likesRegistered || undefined,
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


//TODO
//Edpoint to like and unlike a project by a user

projectRouter.post('/like/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const { like } = req.query
    const { userId } = req.body
    console.log(id, like, userId)
    try {
        const updateProject = await prisma.project.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                likesRegistered: (like === "true" ? { connect: { id: userId  } } : { disconnect: { id: userId  } })
                // likesRegistered: { connect: { id: userId  } }
            },
            include: {
                likesRegistered: true
            }
        })

        res.status(200).send(updateProject)

    } catch (err) {

    }


})

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
            data: deleteOneProject,
            message: "Project deleted ID: " + id
        })
    } catch (error) {
        const isPrismaError = logPrismaError(error)
        res.status(404).send({ success: false, error: isPrismaError || error })
    }
});

export default projectRouter;