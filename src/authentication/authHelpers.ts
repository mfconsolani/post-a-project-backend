import bcrypt from 'bcrypt'
import { prisma, logPrismaError } from '../db';

const hashedPassword = async (email:string) => {
    const hash = await prisma.user.findUnique({
        where: {
            email: email
        }, select: {
            password:true
        }
    })
}

const salt = process.env.SALT_ROUNDS

export const passwordHasher = async (password:string) => {
    try {
        return await bcrypt.hash(password, 10)
    } catch (err) {
        return err
    }
}


export const isValidPassword = async (password: string, hash: string) => {
    try {
        return await bcrypt.compare(password, hash)
    } catch (err) {
        return err
    }
}