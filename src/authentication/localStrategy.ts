import passport from "passport";
import * as passportLocal from 'passport-local'
import { error } from "winston";
import Logger from "../middlewares/winstonLoggerMiddleware";
import { doesUserExists, isValidPassword } from "./authHelpers";

const LocalStrategy = passportLocal.Strategy

passport.use(new LocalStrategy(async (username, password, done) => {

    try {
        const user = await doesUserExists(username)
        const validPassword = await isValidPassword(password, user.password)
        if (error) {
            Logger.error(error)
            return done(error)
        }
        if (!user) {
            return done(null, false, { message: "Invalid username or non existant" })
        }
        if (!validPassword) {
            return done(null, false, { message: "Invalid password" })
        }
        return done(null, { userId: user.id, userName: user.username, userEmail: user.email })
    } catch (err: any) {
        Logger.error(err)
        return err
    }
}))