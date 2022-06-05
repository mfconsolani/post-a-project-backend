import { Request, Response, Router } from "express";
import { prisma } from '../db';
import { verifyToken } from "../middlewares/authenticationJwt";

const skillsRouter = Router()

//Add JWT validation

skillsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const listSkills = await prisma.skills.findMany()
        res.status(200).send(listSkills)
    } catch (err) {
        res.status(400).send({
            success: false,
            message: "Error when retrieving list of skills in database",
            error: err
        })
    }
})

skillsRouter.post('/',verifyToken, async (req: Request, res: Response) => {
    const { skill } = req.body
    try {
        const findSkill = await prisma.skills.findUnique({
            where: {
                skill: skill
            }
        })
        if (findSkill !== null) {
            res.status(401).send({ success: false, message: "Skill already registered in database" })
        } else if (findSkill === null) {
            const createSkill = await prisma.skills.create({
                data: {
                    skill: skill
                }
            })
            res.status(200).send({
                success: true,
                message: "Skill created successfully",
                payload: createSkill
            })
        }
    } catch (err) {
        res.status(400).send({
            success: false,
            message: "Error when creating new skill in database",
            error: err
        })
    }
})


export default skillsRouter