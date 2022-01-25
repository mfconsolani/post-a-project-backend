import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

export const SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN as string
export const SECRET_REFRESH_TOKEN = process.env.SECRET_ACCESS_TOKEN as string
export const SECRET_ACCESS_TOKEN_EXPIRATION = process.env.SECRET_ACCESS_TOKEN_EXPIRATION as string
const SECRET_REFRESH_TOKEN_EXPIRATION = process.env.SECRET_REFRESH_TOKEN_EXPIRATION as string

//TODO
//Fix bad practice of storing tokenList in variable
export let tokenList:string[] = []

interface Tokens {
    accessToken: string,
    refreshToken: string
}

export const getAccessToken = (payload:{}):Tokens => {
    const accessToken = jwt.sign(payload, SECRET_ACCESS_TOKEN , {expiresIn: SECRET_ACCESS_TOKEN_EXPIRATION} )
    const refreshToken = jwt.sign(payload, SECRET_REFRESH_TOKEN , {expiresIn: SECRET_REFRESH_TOKEN_EXPIRATION} )
    tokenList.push(accessToken, refreshToken)
    return { accessToken, refreshToken }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.SECRET_ACCESS_TOKEN as string, (err, user) => {
            if(err) res.status(403).send("Token ain't valid or doesn't exist")
            // console.log(req.user)
            req.user = user;
            next()
        })
    } else {
        res.status(401).send("Not authorized")
    }
}

