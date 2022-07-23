import { Request, Response, Router } from "express";
import { prisma, logPrismaError } from '../db';
import {verifyToken} from '../middlewares/authenticationJwt'

const companyRouter = Router()

//TODO
//Add permision checker: only admin roles authorized
//Add JWT authentication

//find all companies
companyRouter.get("/",verifyToken, async (req: Request, res: Response) => {
    try {
        const getAllCompanies = await prisma.company.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profileType: true
            }
        })
        res.status(200).send({ success: true, message: getAllCompanies })
    } catch (err) {
        res.status(400).send({
            success: false,
            error: err,
            message: "Error when getting all companies"
        })
    }
})

//find one user
companyRouter.get('/:id', verifyToken, async (req: Request, res: Response) => {
    try {
        const findOneCompany = await prisma.company.findUnique({
            where: {
                id: req.params.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profileType: true
            }
        })
        res.status(200).send({ success: true, message: findOneCompany ?? "Company doesn't exist" })
    } catch (error) {
        const isPrismaError = logPrismaError(error)
        res.status(404).send({
            success: false,
            error: isPrismaError || error,
            message: "Error when finding the company requested"
        })
    }
})

export default companyRouter;