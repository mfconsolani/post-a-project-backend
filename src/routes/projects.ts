import { Router, Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const projectRouter = Router()

projectRouter.get('/', async (req:Request, res:Response) => {   
    try {
        const allProjects = await prisma.post.findMany()
        res.status(200).send(allProjects)
    } catch (error) {
        res.status(404).send(error)
    }
});

