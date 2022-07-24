import bcrypt from 'bcrypt'
import { getFileUrl } from '../config/s3';
import { prisma } from '../db';

export const doesUserExists = async (email: string) => {
    try {
        let user = await prisma.user.findUnique({
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
                        roles: true,
                        avatar: true,
                        resume: true
                    }
                }
            }
        })
        if (user?.profile?.avatar) {
            user.profile.avatar = getFileUrl(user?.profile?.avatar).toString()
        }

        if (user?.profile?.resume) {
            user.profile.resume = getFileUrl(user?.profile?.resume).toString()
        }


        const company = await prisma.company.findUnique({
            where: {
                email: email
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
        return (user || company) || false
    } catch (err: any) {
        return err
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

export const storeRefreshJWT = async (userData: any, refreshToken: any) => {
    try {
        if (userData && userData.profileType === "COMPANY") {
            return await prisma.company.update({
                where: {
                    id: userData.id
                }, data: {
                    refreshToken: refreshToken
                }
            })
        } else if (userData && userData.profileType === "USER") {
            return await prisma.user.update({
                where: {
                    id: userData.id
                }, data: {
                    refreshToken: refreshToken
                }
            })
        }
    } catch (err) {
        console.error(err)
        return err
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
                    username: (username ? true : false),
                    profileType: true
                }
            })
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
                    name: (username ? true : false),
                    profileType: true
                }
            })
            return company
        } else {
            return new Error("Error occurred when signing up")
        }
    } catch (err: any) {
        throw err
    }
}