"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = __importDefault(require("faker"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Start seeding ...`);
        for (let i = 0; i < 10; i++) {
            const user = yield prisma.post.create({
                data: {
                    title: faker_1.default.lorem.sentence(),
                    company: faker_1.default.company.companyName(),
                    body: faker_1.default.lorem.sentence(),
                    role: {
                        create: { role: faker_1.default.lorem.word() }
                    },
                    skill: {
                        create: { skill: faker_1.default.lorem.word() }
                    },
                    duration: faker_1.default.random.number(60).toString() + "days",
                    expiresBy: faker_1.default.date.future(),
                    likesCount: faker_1.default.random.number(1000),
                    location: faker_1.default.address.country()
                }
            });
        }
        console.log(`Seeding finished.`);
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
//# sourceMappingURL=seed.js.map