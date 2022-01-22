import bcrypt from 'bcrypt'
import { prisma } from '../db';
import Logger from '../middlewares/winstonLoggerMiddleware';

export const doesUserExists = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        Logger.debug(user)
        return user || false
    } catch (err: any) {
        return err
    }
}

export const astonHasher = (password: string): string => {
    return bcrypt.hashSync(password, 12)
}

export const isValidPassword = async (password: string, userPassword: string) => {
    try {
        return await bcrypt.compare(password, userPassword)
    } catch (err) {
        return err
    }
}

export const createNewUser = async (email: string, password: string, username?: string) => {

    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                username: username,
                password: astonHasher(password)
            }, select: {
                email: true,
                id: true,
                username: (username ? true : undefined)
            }
        })
        return user
    } catch (err: any) {
        return err
    }

}