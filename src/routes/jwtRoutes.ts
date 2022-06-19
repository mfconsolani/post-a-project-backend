import { Router, Request, Response } from "express";
import { handleRefreshToken } from "../helpers/handleRefreshToken";

const jwtRouter = Router()


jwtRouter.get('/refresh', handleRefreshToken)

export default jwtRouter