import { Router, Request, Response } from "express";
import passport from "passport";
import { createNewUser, doesUserExists } from "../authentication/authHelpers";
import Logger from "../middlewares/winstonLoggerMiddleware";
import { getAccessToken, SECRET_ACCESS_TOKEN, SECRET_ACCESS_TOKEN_EXPIRATION, SECRET_REFRESH_TOKEN } from "../middlewares/authenticationJwt";
import * as jwt from 'jsonwebtoken'


//TODO
//Add password regex validation
//Determine if jwt-redis is better than jsonwebtoken for this app
//Return signed token when creating new user
//Fix bad practice of storing refreshTokenList in variable

const authRouter = Router()
let refreshTokenList:string[] = []

authRouter.post('/local/login', 
    passport.authenticate('local',
    { session: false }), 
    (req: Request, res: Response) => {
        try {
            const jwtTokens = getAccessToken({userId: req.user})
            refreshTokenList.push(jwtTokens.refreshToken)
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

authRouter.delete('/local/logout',  (req:Request, res:Response) => {
    const { token } = req.body
    refreshTokenList = refreshTokenList.filter(t => t !== token)
    res.send({token: token, success: "who the fuck knows", tokenList: refreshTokenList})
  });


authRouter.post('/token', (req:Request, res:Response) => {
    const { token } = req.body
    try {
        if (!token) {
            res.status(403).send({success: false, message: "Missing token"})
        }
        if (!refreshTokenList.includes(token)){
            res.status(403).send({success: false, message: "Invalid token"})
        } else {
            //fix user:any type
            jwt.verify(token, SECRET_REFRESH_TOKEN, (err:any, user:any) => {
                if (err) {
                    res.status(403).send({success: false, message: "Error when verifiying token"})
                }
                const newAccessToken = jwt.sign({userId: user.id}, SECRET_ACCESS_TOKEN, {expiresIn: SECRET_ACCESS_TOKEN_EXPIRATION})
                res.status(201).json({accessToken: newAccessToken})
            })
        }
    } catch (err){
        Logger.error(err)
        res.status(400).send({success: false, message: err})
    }
})


export default authRouter;