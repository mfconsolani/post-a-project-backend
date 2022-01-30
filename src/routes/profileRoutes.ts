import { Router, Request, Response } from "express";
import { parse } from "path/posix";
import { prisma, logPrismaError } from '../db';
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
                    companyEmail: email,
                    industry: industry,
                    phoneNumber: phone,
                    employees: employees,
                    description: description,
                    country: country
                }
            })

            res.status(201).send({success: true, message: createProfile})
        } else {
            console.log(!!findCompany, findCompany)
            console.log(!!findProfile, findProfile)
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



export default profileRouter;