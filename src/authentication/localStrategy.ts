import passport from "passport";
import * as passportLocal from 'passport-local'
import { error } from "winston";
import { prisma, logPrismaError } from '../db';

//TODO
//Create isValidPassword
//Install bcrypt and create compare and hash functions

const LocalStrategy = passportLocal.Strategy

passport.use(new LocalStrategy(async (username, password, done) => {
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })
    if (error){
        logPrismaError(error)
        return done(error)
    }
    if (!user){
        return done(null, false, {message: "Invalid username or non existant"})
    }
    if (!password.isValidPassword(password)){
        return done(null, false, {message: "Invalid password"})
    }

    return done(null, user)
}))