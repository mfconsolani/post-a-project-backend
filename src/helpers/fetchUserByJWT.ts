import { prisma } from '../db';


export const findUserByJWT = async (token:any) => {
    try {
        return await prisma.user.findFirst({
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
                        roles: true
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
    } catch (err) {
        console.log(err)
        return err
    }
} 

export const deleteUsersToken = async (userEmail:string, profileType: string) => {
    try {
        if (profileType === "USER"){
            return await prisma.user.update({
                where: {
                    email: userEmail
                }, data: {
                    refreshToken: ''
                }
            })
        } else if (profileType === "COMPANY") {
            return await prisma.company.update({
                where: {
                    email: userEmail
                }, data: {
                    refreshToken: ''
                }
            })
        }        
    } catch (err) {
        console.log(err)
        return err
    }
} 