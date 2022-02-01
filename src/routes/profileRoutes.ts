import { Router, Request, Response } from "express";
import { prisma } from '../db';
import Logger from "../middlewares/winstonLoggerMiddleware";
import { isNewData } from '../helpers/isNewDataPatched'

//TODO
//Create profile schemas or add to User schemas -in which case, add also Company schema
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
//Add the functionality to replace the data now that I can check if data has or not to be replaced
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
                    skills: { connect: mappedData.length > 1 ? mappedData : { skill: skills[0] } }
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
profileRouter.put('/company/:id', (req: Request, res: Response) => {

})

export default profileRouter;