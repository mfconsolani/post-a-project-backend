import { Router, Request, Response } from "express";
import passport from "passport";
import { createNewUser, doesUserExists } from "../authentication/authHelpers";
import Logger from "../middlewares/winstonLoggerMiddleware";

const authRouter = Router()

authRouter.post('/login',
    passport.authenticate('local',
    {
        failureRedirect: '/',
        failureFlash: true,
        failureMessage: "Error when trying to log in",
        successFlash: true,
        successMessage: "Logged in succesfully",
        session: false
    }))

authRouter.post('/signup', async (req: Request, res: Response) => {
    const {username, email, password } = req.body
    console.log(username, email, password)
    try {
        const emailAlreadyExists = await doesUserExists(email)
        Logger.debug(emailAlreadyExists)
        if (emailAlreadyExists.email){
            res.status(409).send({success: false, message: "Email already in use"})
        } else if (!emailAlreadyExists.email){
            const newUser = await createNewUser(email, password, username)
            res.status(201).send({success: true, message: newUser})
        } 
        return "Something unexpected happened"
    } catch (err:any){
        Logger.error(err)
        res.status(400).send({success: false, message: err})
    }


})


export default authRouter;