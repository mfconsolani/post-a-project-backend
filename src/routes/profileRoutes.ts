import { Router, Request, Response } from "express";
import { prisma } from '../db';
import Logger from "../middlewares/winstonLoggerMiddleware";
import { isNewData } from '../helpers/isNewData'

//TODO
//Add validator to check if final user is a company or a user


const profileRouter = Router();


//Post new profile data for company profiles
profileRouter.post('/company/:id', async (req: Request, res: Response) => {
    let { id } = req.params
    const parsedId = parseInt(id)
    const { email, industry, phone, employees, description, country } = req.body

    try {
        const findCompany = await prisma.company.findFirst({
            where: {
                id: parsedId,
                email: email
            }, select: {
                id: true,
                email: true,
                profileType: true
            }
        })

        const findProfile = await prisma.companyProfile.findFirst(email)

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
        } else {
            res.status(400).send({ success: false, message: "Company not registered or profile already registered" })
        }

    } catch (err) {
        Logger.error(err)
        res.status(404).send({ success: false, error: err })
    }
})



//TODO
//Add the functionality to replace the data now that I can check if data has to be replaced or not
//transform isNewData in a helper function that accepts a second function that retrieves the data from DB to be compared vs req.body

//Put/replace profile data for company profiles
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

//post profile data for user profiles
profileRouter.post('/user/:id', async (req: Request, res: Response) => {

    let { id } = req.params
    const parsedId = parseInt(id)
    const { email, firstName, lastName, birthday, phone, city, description, country, skills } = req.body

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
        const findProfile = await prisma.userProfile.findFirst(email)
        let mappedData: any = []
        const mappedSkills = skills.map((skill: any) => {
            mappedData.push({ skill: skill })
            return
        })

        if (findUser && !findProfile) {
            const createProfile = await prisma.userProfile.create({
                data: {
                    user: { connect: { email: email } },
                    firstName: firstName,
                    lastName: lastName,
                    birthday: birthday,
                    phoneNumber: phone,
                    city: city,
                    country: country,
                    description: description,
                    //Pending to check if undefined works if no skills assigned in create profile endpoint
                    skills: { connect: mappedData.length > 1 ? mappedData : { skill: skills[0] || undefined } }
                }
            })

            res.status(201).send({ success: true, message: createProfile })
        } else {
            res.status(400).send({ success: false, message: "User not registered or profile already registered" })
        }

    } catch (err) {
        Logger.error(err)
        res.status(404).send({ success: false, error: err })
    }

})

//Put/replace profile data for user profiles
//TODO
//Add list of Skills to check and be updated. Pending to think about the logic
profileRouter.put('/user/:id', async (req: Request, res: Response) => {
    const { body } = req

    try {
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
        })

        if (!isUpdatedRequired.isNewData) {
            return res.status(200).send({ success: false, message: "Data is not new; no update required" })
        } else {

            //The idea her is get skills in req, and create a new array/object merging the 
            // skills from DB and request and filtering those that are equal
            //But the best choice should be: check new skills and connect and disconnect 
            // the ones that are no longer selected by the user. 
            let mappedData: any = []
            const mappedSkills = body.skills.map((skill: any) => {
                mappedData.push({ skill: skill })
                return
            })
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
                    skills: { connect: mappedData.length > 1 ? mappedData : { skill: body.skills[0] } } 
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