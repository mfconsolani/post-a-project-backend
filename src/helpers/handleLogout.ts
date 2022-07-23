import { Request, Response } from 'express';
import { findUserByJWT, deleteUsersToken } from './fetchUserByJWT';

export const handleLogout = async (req: Request, res: Response) => {
    //on client also delete the access token
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    const token = cookies.jwt
    const findUser = await findUserByJWT(token)
    if (!findUser){
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: "none", secure: true}) //, secure: true  
        return res.sendStatus(204) //No content
    } else {
        //@ts-ignore
         await deleteUsersToken(findUser.id, findUser.profileType)
         res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: "none", secure: true })
         return res.sendStatus(204)
    }
}