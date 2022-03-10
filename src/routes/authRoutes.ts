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
//Implement a token and refresh token black/white list (maybe in redis?)
//Implement emergency loggout or token clear endpoint with right permissions (security meassure)

const authRouter = Router()
let refreshTokenList: string[] = []

authRouter.post('/local/login',
    passport.authenticate('local',
        { session: false }),
    async (req: Request, res: Response) => {
        try {
            const jwtTokens = getAccessToken({ userId: req.user })
            refreshTokenList.push(jwtTokens.refreshToken)
            console.log(req.body.email)
            const userData = await doesUserExists(req.body.email)
            console.log(userData)
            userData && res.status(200).json({
                accessToken: jwtTokens.accessToken,
                refreshToken: jwtTokens.refreshToken,
                success: true,
                message: "Successful login",
                userId: userData.id,
                userEmail: userData.email,
                profile: userData.profileType
            })
        } catch (err: any) {
            Logger.error(err)
            res.status(400).send({ success: false, error: err, message: "User and/or password are invalid" })
        }
    })


authRouter.post('/local/signup', async (req: Request, res: Response) => {
    const { username, email, password } = req.body
    // Logger.info(req.body)
    try {
        const emailAlreadyExists = await doesUserExists(email)
        // Logger.info(emailAlreadyExists)
        if (emailAlreadyExists && emailAlreadyExists.email) {
            res.status(409).json({ success: false, message: "Email already in use" })
        } else if (!emailAlreadyExists) {
            const newUser = await createNewUser(email, password, username)
            res.status(201).json({ success: true, message: newUser })
        }
    } catch (err: any) {
        Logger.error(err)
        res.status(400).send({ success: false, message: err })
    }
})

authRouter.delete('/token/deleteRefresh', (req: Request, res: Response) => {
    const { token } = req.body
    try {
        if (token && refreshTokenList.includes(token)) {
            refreshTokenList = refreshTokenList.filter(t => t !== token)
            res.send({ success: true, message: "Refresh token cleared" })
        } else {
            res.status(404).send({ success: false, message: "Invalid token" })
        }
    } catch (err) {
        Logger.error(err)
        res.status(404).send({ success: false, message: "Error when trying to log out" })
    }
});


authRouter.post('/token/refresh', (req: Request, res: Response) => {
    const { token } = req.body
    try {
        if (!token) {
            res.status(403).send({ success: false, message: "Missing token" })
        }
        if (!refreshTokenList.includes(token)) {
            res.status(403).send({ success: false, message: "Invalid token" })
        } else {
            //fix user:any type
            jwt.verify(token, SECRET_REFRESH_TOKEN, (err: any, user: any) => {
                if (err) {
                    res.status(403).send({ success: false, message: "Error when verifiying token" })
                }
                const newAccessToken = jwt.sign({ userId: user.id }, SECRET_ACCESS_TOKEN, { expiresIn: SECRET_ACCESS_TOKEN_EXPIRATION })
                res.status(201).json({ success: true, accessToken: newAccessToken })
            })
        }
    } catch (err) {
        Logger.error(err)
        res.status(400).send({ success: false, message: err })
    }
})


export default authRouter;