import { Router, Request, Response } from 'express';
import { prisma, logPrismaError } from '../db';

export const projectRouter = Router()

projectRouter.get('/', async (req: Request, res: Response) => {
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
            where:{
                id:parseInt(req.params.id)
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
    const { title, company, body, role, skill, duration, expiresBy, likesCount, location } = req.body
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
                location
            }
        })
        res.status(200).send({success: true, postProject})
    } catch (error: any) {
        const isPrismaError = logPrismaError(error)
        res.status(404).send({ success: false, error: isPrismaError || error })
    }
});

projectRouter.put('/:id', async (req: Request, res: Response) => {
    const { title, company, body, role, skill, duration, expiresBy, likesCount, location } = req.body

    const fieldsToUpdate = await prisma.project.findUnique({
        where:{
            id:parseInt(req.params.id)
        },
        include: {
            role: true,
            skill: true
        }
    })
    // const { id, title, company, body, role, skill, duration, expiresBy, likesCount, location } = fieldsToUpdate
    // const isUpdateRequired = () => {
        const requestFields = Object.entries(req.body).sort()
        // @ts-ignore
        const dataBaseFields = Object.entries(fieldsToUpdate).sort()
        // console.log(dataBaseFields.slice(-1)[0])

        // let differece = requestFields.filter((x:any) => dataBaseFields.includes(x))
        // console.log("difference", differece);
        let valuesToCompare = dataBaseFields.filter((elem, i) => Object.keys(req.body).includes(elem[0]))

        // {
        //     let setOfDifferences = {}
        //     if (elem[i] !== requestFields[i] && elem[1] !== requestFields[i]){
        //         console.log("elem[i]:", [elem[i]], "------ requestFields[1]:", [requestFields[i]])
        //         // let newValue =  {[requestFields[0]]: requestFields[1]}
        //         // @ts-ignore
        //         Object.assign(setOfDifferences, {[requestFields[0]]: requestFields[1]})
        //         return
        //     } 
        //     return setOfDifferences
        // })
        // return difference
    // }
    console.log("Fields to compare", Object.values(valuesToCompare).map(el => el[0]))
    console.log("Values from DB", valuesToCompare)
    console.log("Values from request", requestFields)

    const isUpdateRequired = () => {
        const newValues = {}
        requestFields.map((elem, i) => {

            if (elem[1] !== valuesToCompare[i][1]){
                console.log("New value --> ", elem[1] + "  |----|  " + "Old value --> " + valuesToCompare[i][1] )
                Object.assign(newValues, {[elem[0]]: elem[1]})
            } else {
                return false
            }

        })
        console.log(newValues)
        return newValues ? newValues : false
    }

    isUpdateRequired()

    res.send("hola")
    // console.log(isUpdateRequired())
    
    // try {
    //     const postProject = await prisma.project.update({
    //         where: {
    //             id: parseInt(req.params.id)
    //         },
    //         data: {
    //             title: title || undefined,
    //             company: company || undefined,
    //             body: body || undefined,
    //             role: (!!role ? { connect:  { role: role } } : undefined),
    //             skill: (!!skill ? { connect:  { skill: skill } } : undefined),
    //             duration: duration || undefined,
    //             expiresBy: expiresBy|| undefined,
    //             likesCount: likesCount || undefined,
    //             location: location || undefined
    //         }
    //     })
    //     res.status(200).send({success: true, postProject})
    // } catch (error: any) {
    //     const isPrismaError = logPrismaError(error)
    //     res.status(404).send({ success: false, error: isPrismaError || error })
    // }
});