import { Router, Request, Response } from "express";
import { prisma } from '../db';
import Logger from "../middlewares/winstonLoggerMiddleware";

//TODO
//Create profile schemas or add to User schemas -in which case, add also Company schema
//Add validator to check if final user is a company or a user


const profileRouter = Router();


//Post new profile data
profileRouter.post('/company/:id', async (req:Request, res:Response) => {
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

        if (findCompany && !findProfile){
            const createProfile = await prisma.companyProfile.create({
                data: {
                    company: {connect: {email}},
                    industry: industry,
                    phoneNumber: phone,
                    employees: employees,
                    description: description,
                    country: country
                }
            })

            res.status(201).send({success: true, message: createProfile})
        } else {
            res.status(400).send({success: false, message: "Company not registered or profile already registered"})
        }

    } catch (err){
        Logger.error(err)
        res.status(404).send({success: false, error: err})
    }
})


//Put/replace profile data
profileRouter.put('/company/:id', (req:Request, res:Response) => {

})


profileRouter.post('/user/:id', async (req:Request, res: Response) => {
    
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
        let mappedData:any = []
        const mappedSkills = skills.map((skill:any) => {
            // let mappedStuff = {skill: skill}
            mappedData.push({skill: skill})
            return 
        })

        console.log("mappedData", mappedData)
        console.log(skills)
        // console.log(mappedSkills)
        if (findUser && !findProfile){
            const createProfile = await prisma.userProfile.create({
                data: {
                    user: {connect: {email: email}},
                    firstName: firstName,
                    lastName: lastName,
                    birthday: birthday,
                    phoneNumber: phone,
                    city: city,
                    country: country,
                    description: description,
                    skills: {connect: mappedData.length > 1 ? mappedData : {skill: skills[0]}}
                }
            })

            res.status(201).send({success: true, message: createProfile})
        } else {
            res.status(400).send({success: false, message: "User not registered or profile already registered"})
        }

    } catch (err){
        Logger.error(err)
        res.status(404).send({success: false, error: err})
    }

})

export default profileRouter;