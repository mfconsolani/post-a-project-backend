import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {

    await prisma.post.create({
        data: {
            title: "Arduino Developer for Apolo FX",
            company: "Apolo FX",
            body: "Apolo FX develops professional pedal effects for electric guitars. We are currently developing a new product that requires programing some effects with Arduino in C++",
            role: {
                create: { role: "Arduino Developer"}
            },
            skill: {
                create: { skill: "C++"}
            },
            duration: "3 Months",
            expiresBy: "2022-02-T19:20:30.451Z",
            likesCount: 3
        }
    })
    const allPosts = await prisma.post.findMany()
    console.log(allPosts)
}

main()
.catch(e => { throw e })
.finally(async() => await prisma.$disconnect())

