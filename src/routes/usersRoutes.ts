import { Request, Response, Router } from "express";
import { prisma, logPrismaError } from '../db';

const usersRouter = Router()

//TODO
//Add permision checker: only admin roles authorized
//Add JWT authentication

//find all users
usersRouter.get("/", async (req: Request, res: Response) => {
    try {
        const getAllUsers = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                profileType: true
            }
        })
        res.status(200).send({ success: true, message: getAllUsers })
    } catch (err) {
        res.status(400).send({
            success: false,
            error: err,
            message: "Error when getting all users"
        })
    }
})

//find all users
usersRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const findOneUser = await prisma.user.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                profileType: true
            }
        })
        res.status(200).send({ success: true, message: findOneUser ?? "User doesn't exist" })
    } catch (error) {
        const isPrismaError = logPrismaError(error)
        console.log(error)
        res.status(404).send({
            success: false,
            error: isPrismaError || error,
            message: "Error when finding the user requested"
        })
    }
})

export default usersRouter;