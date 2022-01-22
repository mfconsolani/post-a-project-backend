import bcrypt from 'bcrypt'
import { prisma, logPrismaError } from '../db';

export const userData = async (email:string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }})
        return user
    } catch (err:any) {
        return err
    }
}

export const astonHasher = async (password:string) => {
    try {
        return await bcrypt.hash(password, 12)
    } catch (err) {
        return err
    }
}


export const isValidPassword = async (password: string, userPassword: string) => {
    try {
        return await bcrypt.compare(password, userPassword)
    } catch (err) {
        return err
    }
}