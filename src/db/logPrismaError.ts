import {prismaClientErrorType} from '../db';
import Logger from '../middlewares/winstonLoggerMiddleware';

const logPrismaError = (error:any) => {
    let isPrismaError = prismaClientErrorType(error)
    Logger.error(isPrismaError ? error?.code ?? error?.codeError ?? error?.message : error)
    return isPrismaError
}

export default logPrismaError;