import { PrismaClientKnownRequestError,
    PrismaClientUnknownRequestError,
    PrismaClientRustPanicError,
    PrismaClientInitializationError,
    PrismaClientValidationError
 } from '@prisma/client/runtime';
import { Router, Request, Response } from 'express';
import { prisma } from '../db/prismaGlobal';
import Logger from '../middlewares/winstonLoggerMiddleware';
// import {prismaClientErrorType } from '../db/prismaErrorLogger';


export const projectRouter = Router()

projectRouter.get('/', async (req:Request, res:Response) => {   
    try {
        const allProjects = await prisma.project.findMany()
        res.status(200).send(allProjects)
    } catch (error) {
        res.status(404).send(error)
    }
});

projectRouter.post('/', async (req:Request, res:Response) => {   
    try {
        const postProject = await prisma.project.create({
            data: {
                title: "sda",
                company: "sada",
                body: "sadaadsa",
                role: {
                    create: { role: "AArduino Developerr"}
                },
                skill: {
                    create: { skill: "C+++"}
                },
                duration: "3 DAys",
                expiresBy: "2022-11-25T05:48:55.814Z",
                likesCount: 4,
                location: "Arg"
            }
        })
        res.status(200).send(postProject)
    } catch (error) {
        // let isPrismaError = prismaClientErrorType(error)
        if (error instanceof PrismaClientValidationError) {
            res.status(404).send(Logger.error("hola"))
        }
    } 
});


