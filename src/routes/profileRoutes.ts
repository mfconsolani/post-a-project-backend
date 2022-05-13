import { Router, Request, Response } from "express";
import { prisma } from '../db';
import Logger from "../middlewares/winstonLoggerMiddleware";
import { isNewData } from '../helpers/isNewData'

//TODO
//Add validator to check if final user is a company or a user
//Add JWT verification

const profileRouter = Router();

//Post new profile data for company profiles
profileRouter.post('/company/:id', async (req: Request, res: Response) => {
    let { id } = req.params
    const parsedId = parseInt(id)
    const { email, industry, phone, employees, description, country } = req.body

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
        console.log("findCompany", findCompany, "findProfile", findProfile)

        if (findCompany && !findProfile) {
            const createProfile = await prisma.companyProfile.create({
                data: {
                    company: { connect: { email } },
                    industry: industry,
                    phoneNumber: phone,
                    employees: employees,
                    description: description,
                    country: country
                }
            })

            res.status(201).send({ success: true, message: createProfile })
        } else if (findCompany && findProfile) {
            const updateProfile = await prisma.companyProfile.update({
                where: {companyEmail: email},
                data: {
                    industry: industry,
                    phoneNumber: phone,
                    employees: employees,
                    country: country,
                    description: description
                },
                // include: {
                //     skills: true,
                //     roles: true
                // }
            })

            // industry: body.industry || undefined,
            // phoneNumber: body.phoneNumber || undefined,
            // employees: body.employees || undefined,
            // description: body.description || undefined,
            // country: body.country || undefined
            res.status(201).send({ success: true, payload: updateProfile, message: "Profile updated" })
        }
    } catch (err) {
        Logger.error(err)
        res.status(404).send({ success: false, error: err })
    }
})

//Put/replace profile data for company profiles
//this will become probably useless given that this utility will be replaced by the post method
profileRouter.put('/company/:id', async (req: Request, res: Response) => {
    const { body } = req

    try {
        const isUpdatedRequired = await isNewData(req, async (arg: any) => {
            return await prisma.companyProfile.findUnique({
                where: {
                    companyEmail: arg.companyEmail
                }, select: {
                    companyEmail: true,
                    industry: true,
                    phoneNumber: true,
                    employees: true,
                    description: true,
                    country: true
                }
            })
        })

        if (!isUpdatedRequired.isNewData) {
            return res.status(200).send({ success: false, message: "Data is not new; no update required" })
        } else {
            const updateProfile = await prisma.companyProfile.update({
                where: {
                    companyEmail: body.companyEmail
                },
                data: {
                    //For the moment companyEmail shouldn't be modified as it would mess up all the DB table relations
                    //TODO
                    //For the future, use id for relation scalar field instead of email.
                    companyEmail: undefined,
                    industry: body.industry || undefined,
                    phoneNumber: body.phoneNumber || undefined,
                    employees: body.employees || undefined,
                    description: body.description || undefined,
                    country: body.country || undefined
                }
            })
            res.status(201).send({ success: true, updateProfile })
        }
    } catch (err) {
        console.log(err)
        res.status(404).send({ success: false, error: err, message: "Unexpected error when updating profile" })
    }
})

//post or updates profile data for user profiles
profileRouter.post('/user/:id', async (req: Request, res: Response) => {
    let { id } = req.params
    const parsedId = parseInt(id)
    const { email, firstName, lastName, birthday, phone, city, description, country, skills, roles } = req.body
    const mappedSkills = skills.map((skill:any) =>  {
        return {"skill": skill.value}
    })
    const mappedRoles = roles.map((role:any) =>  {
        return {"role": role.value}
    })
    console.log(mappedRoles, mappedSkills)
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
                skills: {select: {skill: true}},
                roles: {select: {role: true}}
            }
        })
        // console.log("findUser", findUser, "findProfile", findProfile)
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
                }
            })
            res.status(201).send({ success: true, payload: createProfile, message: "Profile created" })
        } else if (findUser && findProfile) {
            const updateProfile = await prisma.userProfile.update({
                where: {userEmail: email},
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

//Put/replace profile data for user profiles
//this is probably useless now given that this method is covered by the previos one
profileRouter.put('/user/:id', async (req: Request, res: Response) => {
    const { body } = req

    try {
        const skillsInDb = await prisma.userProfile.findUnique({
            where: {
                userEmail: body.userEmail
            }, include: {
                skills: { select: { skill: true } }
            }
        })
        const isUpdatedRequired = await isNewData(req, async (arg: any) => {
            return await prisma.userProfile.findUnique({
                where: {
                    userEmail: arg.userEmail
                }, select: {
                    userEmail: true,
                    firstName: true,
                    lastName: true,
                    birthday: true,
                    phoneNumber: true,
                    city: true,
                    country: true,
                    description: true,
                    skills: true
                }
            })
        }, req.body.skills, skillsInDb?.skills)

        if (!isUpdatedRequired.isNewData) {
            return res.status(200).send({ success: false, message: "Data is not new; no update required" })
        } else {
            const updateProfile = await prisma.userProfile.update({
                where: {
                    userEmail: body.userEmail
                },
                data: {
                    userEmail: undefined,
                    firstName: body.firstName || undefined,
                    lastName: body.lastName || undefined,
                    birthday: body.birthday || undefined,
                    phoneNumber: body.phoneNumber || undefined,
                    city: body.city || undefined,
                    country: body.country || undefined,
                    description: body.description || undefined,
                    skills: { disconnect: skillsInDb?.skills, connect: body.skills },
                }, include: {
                    skills: { select: { skill: true } }
                }
            })
            res.status(201).send({ success: true, updateProfile })
        }
    } catch (err) {
        console.log(err)
        res.status(404).send({ success: false, error: err, message: "Unexpected error when updating profile" })
    }

})


export default profileRouter;