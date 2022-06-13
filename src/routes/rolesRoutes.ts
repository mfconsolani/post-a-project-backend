import { Request, Response, Router } from "express";
import { prisma } from '../db';
import { verifyToken } from "../middlewares/authenticationJwt";
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
            error: err
        })
    }
})

rolesRouter.post('/',verifyToken, async (req: Request, res: Response) => {
    const { role } = req.body
    try {
        const findRole = await prisma.roles.findUnique({
            where: {
                role: role
            }
        })
        if (findRole !== null) {
            res.status(400).send({ success: false, message: "Role already registered in database" })
        } else if (findRole === null) {
            const createRole = await prisma.roles.create({
                data: {
                    role: role
                }
            })
            res.status(200).send({
                success: true,
                message: "Role created successfully",
                payload: createRole
            })
        }
    } catch (err) {
        res.status(400).send({
            success: false,
            message: "Error when creating new role in database",
            error: err
        })
    }
})

export default rolesRouter