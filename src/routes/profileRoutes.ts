import { Router, Request, Response } from "express";
import { send } from "process";
import { prisma } from '../db';
import Logger from "../middlewares/winstonLoggerMiddleware";

//TODO
//Create profile schemas or add to User schemas -in which case, add also Company schema
//Add validator to check if final user is a company or a user


const profileRouter = Router();


//Post new profile data for company profiles
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



//TODO
//Add the functionality to replace the data now that I can check if data has or not to be replaced
//transform isNewData in a helper function that accepts a second function that retrieves the data from DB to be compared vs req.body

//Put/replace profile data for company profiles
profileRouter.put('/company/:id', (req:Request, res:Response) => {
    let { body } = req
    console.log(body)

    try {
        const isNewData = async (body:any) => {
            // const { email: companyEmail, phone: phoneNumber } = body
            const getCurrentRecords = await prisma.companyProfile.findUnique({
                where: {
                    companyEmail: body.companyEmail
                }, select: {
                    companyEmail: true,
                    industry: true,
                    phoneNumber: true,
                    employees: true,
                    description: true,
                    country: true
                }
            })
            console.log(getCurrentRecords)
            //@ts-ignore
            //Return array from data records in DB and sort
            const valuesFromDB = Object.entries(getCurrentRecords).sort()
            //Return array from values incoming from requests and sort
            const valuesFromRequest = Object.entries(body).sort()
            //Filter only the key-value pairs from the DB query that match the key-value pairs requested to be updated
            const fieldsToCompare = valuesFromDB.filter((elem, i) => Object.keys(body).includes(elem[0]))
        
            // Uncomment loggers for debugging purposes
            Logger.info("Fields to compare --> " + Object.values(fieldsToCompare).map(el => el[0]))
            Logger.info("Current values in DB --> " + fieldsToCompare)
            Logger.info("Incoming values from request --> " + valuesFromRequest)
        
            //Compare incoming values from request vs data currently in DB
            const isUpdateRequired = () => {
                const newValues = {}
                //@ts-ignore
                valuesFromRequest.map((elem, i) => {
                    if (elem[1] !== fieldsToCompare[i][1]) {
                        Logger.info("New value --> " + elem[1] + "  |----|  " + "Old value --> " + fieldsToCompare[i][1])
                        Object.assign(newValues, { [elem[0]]: elem[1] })
                    } else {
                        return false
                    }
                })
                return Object.keys(newValues).length > 0 ? { isNewData: true, newValues } : { isNewData: false }
            }
            return isUpdateRequired()
        }

        isNewData(body)
        res.status(200).send({success:true})
        // if (!!isNewData(body)){
        //     res.status(200).send({success: true})
        // } 

    } catch (err){
        console.log(err)
        res.status(404).send({success: false, error: err}) 
    }


})

//post profile data for user profiles
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
            mappedData.push({skill: skill})
            return 
        })

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

//Put/replace profile data for user profiles
profileRouter.put('/company/:id', (req:Request, res:Response) => {

})

export default profileRouter;