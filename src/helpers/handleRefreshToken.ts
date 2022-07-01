import { Request, Response } from 'express';
import { prisma } from '../db';
import * as jwt from 'jsonwebtoken'
import { SECRET_ACCESS_TOKEN, SECRET_ACCESS_TOKEN_EXPIRATION, SECRET_REFRESH_TOKEN } from "../middlewares/authenticationJwt";

export const handleRefreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(401).send({ success: false, message: "Unauthorized" })
    const token = cookies.jwt
    const findUser = await prisma.user.findFirst({
        where: {
            refreshToken: token
        }, include: {
            profile: {
                select: {
                    firstName: true,
                    lastName: true,
                    birthday: true,
                    phoneNumber: true,
                    city: true,
                    country: true,
                    description: true,
                    skills: true,
                    roles: true,
                    avatar: true,
                    resume: true
                }
            }
        }
    }) || await prisma.company.findFirst({
        where: {
            refreshToken: token
        }, include: {
            profile: {
                select: {
                    industry: true,
                    phoneNumber: true,
                    employees: true,
                    description: true,
                    country: true,
                }
            }
        }
    })
    if (!findUser) return res.status(403).send({ success: false, message: "Access Forbidden" })
    jwt.verify(token, SECRET_REFRESH_TOKEN,
        (err: any, user: any) => {
            if (err || findUser.id !== user.userId) return res.status(403).send({
                success: false,
                message: "Access Forbidden or Token Expired"
            })
            const newAccessToken = jwt.sign({
                userId: user.userId
            },
                SECRET_ACCESS_TOKEN,
                {
                    expiresIn: SECRET_ACCESS_TOKEN_EXPIRATION
                })
            res.status(200).json({
                accessToken: newAccessToken,
                success: true,
                userId: findUser.id,
                userEmail: findUser.email,
                profile: findUser.profileType,
                profileData: findUser.profile
            })
        })
}