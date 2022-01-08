import { PrismaClient } from "@prisma/client"
import faker from 'faker';
const prisma = new PrismaClient()

async function main() {
    console.log(`Start seeding ...`)
    for (let i = 0; i < 10; i++) {
        const user = await prisma.post.create({
            data: {
                title: faker.lorem.sentence(),
                company: faker.company.companyName(),
                body: faker.lorem.sentence(),
                role: {
                    create: { role: faker.lorem.word() }
                },
                skill: {
                    create: { skill: faker.lorem.word() }
                },
                duration: faker.datatype.number(40) + "days",
                expiresBy: faker.date.future(),
                likesCount: faker.datatype.number(),
                location: faker.address.country()
            }
        })
    }
    console.log(`Seeding finished.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
