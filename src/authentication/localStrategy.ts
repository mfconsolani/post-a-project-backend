import Local from "passport-local";
import Logger from "../middlewares/winstonLoggerMiddleware";
import { doesUserExists, isValidPassword } from "./authHelpers";

//TODO
//add regex to password check
//add email to the return object
//add ProfileType to the return object



export const LocalStrategy = new Local.Strategy(
        { 
        usernameField:'email', 
        passwordField: 'password'
        }, 
        async (email, password, done) => {
            try {
                const user = await doesUserExists(email)
                const validPassword = await isValidPassword(password, user.password)
                if (!user) {
                    return done(null, false)
                }
                if (!validPassword) {
                    return done(null, false)
                }
                return done(null, user.id)
            } catch (err: any) {
                Logger.error(err)
                console.log(err)
                return err
            }
        })