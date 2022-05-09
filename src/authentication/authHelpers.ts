import bcrypt from 'bcrypt'
import { prisma } from '../db';
import Logger from '../middlewares/winstonLoggerMiddleware';


//TODO
//CreateNewUser function does not adapt to the new user schema. Fix
export const doesUserExists = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
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
                        roles: true
                    }
                }
            }
        })
        // console.log(user)
        return user || false
    } catch (err: any) {
        throw err
    }
}

export const ashtonHasher = (password: string): string => {
    return bcrypt.hashSync(password, 12)
}

export const isValidPassword = async (password: string, userPassword: string) => {
    try {
        return await bcrypt.compare(password, userPassword)
    } catch (err: any) {
        throw err
    }
}

export const createNewUser = async (email: string, password: string, profileType: string, username?: string) => {
    try {
        if (profileType === "USER") {
            const user = await prisma.user.create({
                data: {
                    email: email,
                    username: (username ? username : undefined),
                    password: ashtonHasher(password)
                }, select: {
                    email: true,
                    id: true,
                    username: (username ? true : false)
                }
            })
            console.log(user)
            return user
        } else if (profileType === "COMPANY") {
            const company = await prisma.company.create({
                data: {
                    email: email,
                    name: (username ? username : undefined),
                    password: ashtonHasher(password)
                }, select: {
                    email: true,
                    id: true,
                    name: (username ? true : false)
                }
            })
            console.log(company)
            return company
        } else {
            throw new Error("Error occurred when signing up")
        }
    } catch (err: any) {
        throw err
    }

}