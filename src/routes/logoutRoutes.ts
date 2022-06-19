import { Router, Request, Response } from "express";
import { getAccessToken, SECRET_ACCESS_TOKEN, SECRET_ACCESS_TOKEN_EXPIRATION, SECRET_REFRESH_TOKEN, verifyToken } from "../middlewares/authenticationJwt";
import { handleLogout } from "../helpers/handleLogout";

const logoutRouter = Router()

logoutRouter.get('/', handleLogout)

export default logoutRouter