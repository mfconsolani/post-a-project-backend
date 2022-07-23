import { Router, Request, Response } from 'express';
import { prisma, logPrismaError } from '../db';
import { isNewData } from '../helpers/isNewData';
import { verifyToken } from '../middlewares/authenticationJwt';
const projectRouter = Router()

projectRouter.get('/', async (_req: Request, res: Response) => {
    try {
        const findAllProjects = await prisma.project.findMany({
            include: {
                skill: true,
                role: true,
                likesRegistered: {
                    select: {
                        id: true
                    }
                },
                applicationsRegistered: {
                    select: {
                        id: true
                    }
                }
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
        if (!findOneProject) {
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
projectRouter.post('/',verifyToken, async (req: Request, res: Response) => {
    const { id, title, company, body, roles, skills, duration, expiresBy, likesCount, location, owner } = req.body
    // Extract ID from req.body to afterwards connect the ID to the projectOwner

    const mappedSkills = skills.map((skill: any) => {
        return { "skill": skill.value }
    })
    const mappedRoles = roles.map((role: any) => {
        return { "role": role.value }
    })
    try {
        const postProject = await prisma.project.create({
            data: {
                title,
                company: company || owner,
                body,
                role: { connect: mappedRoles },
                skill: { connect: mappedSkills },
                duration,
                expiresBy,
                likesCount: 0,
                // likesRegistered: undefined,
                location,
                //@ts-ignore
                projectOwner: { connect: { companyId: id } }// ----> POSSIBLE DB ERROR HERE AFTER CHANGES IN DB ID AS UUID IS A STRING
                // projectOwner: { connect: { companyEmail: owner } }
            }
        })
        res.status(201).send({ success: true, payload: postProject, message: "Project created successfully" })
    } catch (error: any) {
        const isPrismaError = logPrismaError(error)
        res.status(404).send({ success: false, error: isPrismaError || error, message: "Error 404" })
    }
});


//TODO
//THIS HAS TO BE RE-THOUGHT. ISN'T THERE A BETTER WAY TO DO THIS?
// Implement the same logic for roles as in with skills to check if update is required and update it if
// it comes to it
// This endpoint should only be available for COMPANY profile types and checking id in request previously
projectRouter.put('/:id',verifyToken, async (req: Request, res: Response) => {
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
            return res.status(200).send({ success: true, message: "Data is not new; no update required" })
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
                    skill: (!!body.skill ? { connect: body.skill.map((elem: any) => { return { skill: elem } }) } : undefined),
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
//must verify that the user liking the project has a token with their corresponding id 
//must also verify that the profile type is company
projectRouter.post('/like/:id',verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params
    const { like } = req.query
    const { profileType, userId } = req.body.user

    if (profileType === "USER") {
        try {

            let updateProject = await prisma.project.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    likesRegistered: (like === "true" ? { connect: { id: userId } } : { disconnect: { id: userId } })
                },
                select: {
                    _count: {
                        select: { likesRegistered: true }
                    },
                    likesRegistered: {
                        select: { id: true }
                    }
                }
            })
            Object.assign(updateProject, { isLiked: updateProject.likesRegistered.some(elem => elem.id === userId) })
            res.status(200).send({
                success: true,
                payload: {
                    likesCount: updateProject._count.likesRegistered || 0,
                    //@ts-ignore
                    isLiked: updateProject.isLiked,
                    likesRegistered: updateProject.likesRegistered
                },
            })
        } catch (err) {
            res.status(404).send({ success: false, message: "Failed to like or unlike project", error: err })
        }
    } else {
        res.status(405).send({ success: false, message: "Method not allowed for Company profiles" })
    }
})

//Get initial likeCount
projectRouter.get('/like/:id', async (req: Request, res: Response) => {
    try {
        const getProjectCount = await prisma.project.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            select: {
                _count: {
                    select: { likesRegistered: true }
                },
                likesRegistered: {
                    select: {
                        id: true
                    }
                }
            }
        })
        res.status(200).send({ success: true, payload: getProjectCount })
    } catch (err) {
        res.status(404).send({ success: false, message: "Failed to get likes count for this project", error: err })
    }
})

//TODO
//Edpoint to apply and discard a project by a user
//must verify that the user applying/discarding the project has a token with their corresponding id 
projectRouter.post('/apply/:id',verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params
    const { apply } = req.query
    const { profileType, userId } = req.body.user

    if (profileType === "USER") {
        try {
            const updateProject = await prisma.project.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    applicationsRegistered: (apply === "true" ? { connect: { id: userId } } : { disconnect: { id: userId } })
                },
                select: {
                    _count: {
                        select: { applicationsRegistered: true }
                    },
                    title: true,
                    applicationsRegistered: {
                        select: { id: true }
                    }
                }
            })
            res.status(200).send({
                success: true,
                payload: {
                    applicationsCount: updateProject._count.applicationsRegistered || 0,
                    isApplied: updateProject.applicationsRegistered.some(elem => elem.id === userId),
                    applicationsRegistered: updateProject.applicationsRegistered,
                    projectTitle: updateProject.title
                }
            })
        } catch (err) {
            console.log(err)
            res.status(404).send({ success: false, message: "Failed to apply or discard project", error: err })
        }
    } else {
        res.status(405).send({ success: false, message: "Method not allowed for Company profiles" })
    }
})

//Get initial applyCount
projectRouter.get('/apply/:id', async (req: Request, res: Response) => {
    try {
        const getProjectCount = await prisma.project.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            select: {
                _count: {
                    select: { applicationsRegistered: true }
                },
                applicationsRegistered: {
                    select: {
                        id: true
                    }
                }
            }
        })
        res.status(200).send({ success: true, payload: getProjectCount })
    } catch (err) {
        res.status(404).send({ success: false, message: "Failed to get likes count for this project", error: err })
    }
})

projectRouter.delete('/:id',verifyToken, async (req: Request, res: Response) => {
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