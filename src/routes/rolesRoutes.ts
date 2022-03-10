import { Request, Response, Router } from "express";
import { prisma } from '../db';

const rolesRouter = Router()

//Add JWT validation

rolesRouter.get('/', async (req: Request, res: Response) => {
    try {
        const listRoles = await prisma.roles.findMany()
        res.status(200).send(listRoles)        
    } catch (err) {
        res.status(400).send({
            success: false, 
            message: "Error when retrieving list of roles in database", 
            error: err})
    }
})

//TODO
//Post new skill
// skillsRouter.post('/', async (req: Request, res: Response) => {
//     try {
//         // const listSkills = await prisma.skills.findMany()
//         // res.status(200).send(listSkills)        
//     } catch (err) {
//     //     res.status(400).send({
//     //         success: false, 
//     //         message: "Error when retrieving list of skills in database", 
//     //         error: err})
//     // }
// })

export default rolesRouter