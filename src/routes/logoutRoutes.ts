import { Router, Request, Response } from "express";
import { handleLogout } from "../helpers/handleLogout";

const logoutRouter = Router()

logoutRouter.get('/', handleLogout)

export default logoutRouter