import { Router, Request, Response } from "express";
import passport from "passport";
import { createNewUser, doesUserExists } from "../authentication/authHelpers";
import Logger from "../middlewares/winstonLoggerMiddleware";
import { getAccessToken, verifyToken } from "../middlewares/authenticationJwt";

const authRouter = Router()

//TODO
//Add password regex validation
//Determine if jwt-redis is better than jsonwebtoken for this app
//Implement refresh token endpoint
//Return signed token when creating new user

authRouter.post('/local/login', 
    passport.authenticate('local',
    { session: false }), 
    (req: Request, res: Response) => {
        try {
            const jwtTokens = getAccessToken({userId: req.user})
            res.status(200).json({accessToken: jwtTokens.accessToken, refreshToken: jwtTokens.refreshToken})
        } catch (err:any) {
            Logger.error(err)
            res.status(400).send({success: false, error: err, message: "User and/or password are invalid"})
        }
    })

authRouter.post('/local/signup', async (req: Request, res: Response) => {
    const { username, email, password } = req.body
    try {
        const emailAlreadyExists = await doesUserExists(email)
        if (emailAlreadyExists.email){
            res.status(409).send({success: false, message: "Email already in use"})
        } else if (!emailAlreadyExists.email){
            const newUser = await createNewUser(email, password, username)
            res.status(201).send({success: true, message: newUser})
        } 
        return
    } catch (err:any){
        Logger.error(err)
        res.status(400).send({success: false, message: err})
    }
})

authRouter.delete('/local/logout', verifyToken,  (req:Request, res:Response) => {
    console.log(req?.user, req.body)
    console.log("I'm inside")

    if (req.user !== ''){
        try {
            req.user = '';
            console.log("req.user" + req?.user, "req.body" + req.body,"req.cookies" + req.cookies)
            res.send('logged out');
        } catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    } else {
        res.send('Nothing te be logged out from')
    }

  });


export default authRouter;