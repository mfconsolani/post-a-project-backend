import { Router, Request, Response } from "express";
import { prisma } from '../db';
import Logger from "../middlewares/winstonLoggerMiddleware";
import { verifyToken } from '../middlewares/authenticationJwt'
import { uploadFile, getFileStream, deleteFile } from "../config/s3";
import multer from 'multer'
import fs from 'fs';
import util from 'util'

//TODO
//Add validator to check if final user is a company or a user
const unlinkFile = util.promisify(fs.unlink)
const upload = multer({ dest: 'uploads/' })
const profileRouter = Router();

profileRouter.post('/user/file/avatar', [verifyToken, upload.single('file')], async (req: Request, res: Response) => {
    const { email } = req.body
    try {
        const result: any = await uploadFile(req.file)
        //@ts-ignore
        await unlinkFile(req.file.path)
        const updateFile = await prisma.userProfile.update({
            where: { userEmail: email },
            data: {
                avatar: result.Key
            }
        })
        res.send({ filePath: `/${result.Key}` })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


profileRouter.post('/user/file/resume', [verifyToken, upload.single('file')], async (req: Request, res: Response) => {
    const { email } = req.body
    try {
        const result: any = await uploadFile(req.file)
        //@ts-ignore
        await unlinkFile(req.file.path)
        const updateFile = await prisma.userProfile.update({
            where: { userEmail: email },
            data: {
                resume: result.Key
            }
        })
        res.send({ filePath: `/${result.Key}` })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

profileRouter.get('/user/file/avatar/:key', verifyToken, async (req: Request, res: Response) => {
    try {
        const getAvatarKey = await prisma.userProfile.findFirst({
            where: {
                avatar: req.params.key
            },
            select: {
                avatar: true
            }
        })
        !getAvatarKey?.avatar
            ? res.sendStatus(404) //File not found 
            //@ts-ignore
            : getFileStream(getAvatarKey?.avatar).pipe(res)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

profileRouter.get('/user/file/resume/:key', verifyToken, async (req: Request, res: Response) => {
    try {
        const getResumeKey = await prisma.userProfile.findFirst({
            where: {
                resume: req.params.key
            },
            select: {
                resume: true
            }
        })
        if (!getResumeKey?.resume) {
            res.sendStatus(404) //File not found
        }
        //@ts-ignore
        const resume = getFileStream(getResumeKey?.resume, "resume")
        res.status(200).send({success: true, payload: resume})

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

profileRouter.delete('/user/file/resume/:key', verifyToken, async (req: Request, res: Response) => {
    try {
        const getResumeKey = await prisma.userProfile.findFirst({
            where: {
                resume: req.params.key
            },
            select: {
                resume: true
            }
        })
        if (!getResumeKey?.resume) {
            res.sendStatus(404) //File not found 
        } else {
            await deleteFile(getResumeKey?.resume)
            await prisma.userProfile.update({
                where: {
                    resume: req.params.key
                },
                data: {
                    resume: ''
                }
            })
            res.sendStatus(200)
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

profileRouter.delete('/user/file/avatar/:key', verifyToken, async (req: Request, res: Response) => {
    try {
        const getAvatarKey = await prisma.userProfile.findFirst({
            where: {
                avatar: req.params.key
            },
            select: {
                avatar: true
            }
        })
        if (!getAvatarKey?.avatar) {
            res.sendStatus(404) //File not found 
        } else {
            await deleteFile(getAvatarKey?.avatar)
            await prisma.userProfile.update({
                where: {
                    avatar: req.params.key
                },
                data: {
                    avatar: ''
                }
            })
            res.sendStatus(200)
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


//Post new profile data for company profiles
profileRouter.post('/company/:id', verifyToken, async (req: Request, res: Response) => {
    let { id } = req.params
    const parsedId = parseInt(id)
    const { email, industry, phoneNumber, employees, description, country } = req.body

    try {
        const findCompany = await prisma.company.findUnique({
            where: {
                email: email
            }, select: {
                id: true,
                email: true,
                profileType: true
            }
        })
        const findProfile = await prisma.companyProfile.findUnique({
            where: {
                companyEmail: email
            }
        })

        if (findCompany && !findProfile) {
            const createProfile = await prisma.companyProfile.create({
                data: {
                    company: { connect: { email } },
                    industry: industry,
                    phoneNumber: parseInt(phoneNumber),
                    employees: employees,
                    description: description,
                    country: country
                }
            })

            res.status(201).send({ success: true, message: createProfile })
        } else if (findCompany && findProfile) {
            const updateProfile = await prisma.companyProfile.update({
                where: { companyEmail: email },
                data: {
                    industry: industry,
                    phoneNumber: parseInt(phoneNumber),
                    employees: employees,
                    country: country,
                    description: description
                },
            })
            res.status(201).send({ success: true, payload: updateProfile, message: "Profile updated" })
        }
    } catch (err) {
        Logger.error(err)
        res.status(404).send({ success: false, error: err })
    }
})


//post or updates profile data for user profiles
profileRouter.post('/user/:id', verifyToken, async (req: Request, res: Response) => {
    let { id } = req.params
    const parsedId = parseInt(id)
    const { email, firstName, lastName, birthday, phone, city, description, country, skills, roles } = req.body
    const mappedSkills = skills.map((skill: any) => {
        return { "skill": skill.value }
    })
    const mappedRoles = roles.map((role: any) => {
        return { "role": role.value }
    })
    try {
        const findUser = await prisma.user.findFirst({
            where: {
                id: parsedId,
                email: email
            }, select: {
                id: true,
                email: true,
                profileType: true
            }
        })
        const findProfile = await prisma.userProfile.findFirst({
            where: {
                userEmail: email
            }, select: {
                id: true,
                userEmail: true,
                skills: { select: { skill: true } },
                roles: { select: { role: true } }
            }
        })
        if (findUser && !findProfile) {
            const createProfile = await prisma.userProfile.create({
                data: {
                    user: { connect: { email: email } },
                    firstName: firstName,
                    lastName: lastName,
                    birthday: birthday,
                    phoneNumber: parseInt(phone),
                    city: city,
                    country: country,
                    description: description,
                    skills: { connect: mappedSkills },
                    roles: { connect: mappedRoles }
                },
                include: {
                    skills: true,
                    roles: true
                }
            })
            res.status(201).send({ success: true, payload: createProfile, message: "Profile created" })
        } else if (findUser && findProfile) {
            const updateProfile = await prisma.userProfile.update({
                where: { userEmail: email },
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    birthday: birthday,
                    phoneNumber: parseInt(phone),
                    city: city,
                    country: country,
                    description: description,
                    skills: { disconnect: findProfile.skills, connect: mappedSkills },
                    roles: { disconnect: findProfile.roles, connect: mappedRoles }
                },
                include: {
                    skills: true,
                    roles: true
                }
            })
            res.status(201).send({ success: true, payload: updateProfile, message: "Profile updated" })
        }

    } catch (err) {
        Logger.error(err)
        res.status(404).send({ success: false, error: err })
    }

})




export default profileRouter;