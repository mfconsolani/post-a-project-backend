import { Router, Request, Response } from "express";
import { prisma, logPrismaError } from '../db';

//TODO
//Create profile schemas or add to User schemas -in which case, add also Company schema


const profileRoutes = Router();


//Post new profile data
profileRoutes.post('/:id', (req:Request, res:Response) => {

})


//Put/replace profile data
profileRoutes.put('/:id', (req:Request, res:Response) => {

})



