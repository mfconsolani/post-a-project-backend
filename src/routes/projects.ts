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

projectRouter.get('/', async (req:Request, res:Response) => {   
    try {
        const postProject = await prisma.post.create({
            data: {
                title: "Arduino Developer for Apolo FX",
                company: "Apolo FX",
                body: "Apolo FX develops professional pedal effects for electric guitars. We are currently developing a new product that requires programing some effects with Arduino in C++",
                role: {
                    create: { role: "Arduino Developer"}
                },
                skill: {
                    create: { skill: "C++"}
                },
                duration: "3 Months",
                expiresBy: "2022-02-T19:20:30.451Z",
                likesCount: 3,
                location: "Argentina"
            }
        })
    } catch (error) {
        res.status(404).send(error)
    }
});