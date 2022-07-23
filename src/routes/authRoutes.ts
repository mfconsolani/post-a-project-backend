import { Router, Request, Response } from "express";
import passport from "passport";
import { createNewUser, doesUserExists, storeRefreshJWT } from "../authentication/authHelpers";
import Logger from "../middlewares/winstonLoggerMiddleware";
import { getAccessToken } from "../middlewares/authenticationJwt";

//TODO
//Add password regex validation
//Implement emergency loggout or token clear endpoint with right permissions (security meassure)
//Change payload for JWT


const authRouter = Router()

authRouter.post('/local/login',
    passport.authenticate('local',
        { session: false }),
    async (req: Request, res: Response) => {
        try {
            const jwtTokens = getAccessToken({ userId: req.user })
            const userData = await doesUserExists(req.body.email)
            await storeRefreshJWT(userData, jwtTokens.refreshToken)
            userData && res.cookie('jwt', jwtTokens.refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: "none", secure: true })
            userData && res.status(200).json({
                accessToken: jwtTokens.accessToken,
                success: true,
                message: "Successful login",
                userId: userData.id,
                userEmail: userData.email,
                profile: userData.profileType,
                profileData: userData.profile
            })
        } catch (err: any) {
            Logger.error(err)
            res.status(400).send({ success: false, error: err, message: "User and/or password are invalid" })
        }
    })


authRouter.post('/local/signup', async (req: Request, res: Response) => {
    const { username, email, password, profileType } = req.body
    try {
        const emailAlreadyExists = await doesUserExists(email)
        if (emailAlreadyExists && emailAlreadyExists.email) {
            res.status(409).json({ success: false, message: "Email already in use" })
        } else if (!emailAlreadyExists) {
            const newUser = await createNewUser(email, password, profileType, username)
            //@ts-ignore
            const jwtTokens = getAccessToken({ userId: newUser.id })
            await storeRefreshJWT(newUser, jwtTokens.refreshToken)
            res.cookie('jwt', jwtTokens.refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: "none", secure: true })
            res.status(201).json({ success: true, payload: {...newUser, accessToken: jwtTokens.accessToken} })
        }
    } catch (err: any) {
        Logger.error({ success: false, message: err })
        res.status(400).send({ success: false, message: "Error occurred when signing up" })
    }
})

export default authRouter;