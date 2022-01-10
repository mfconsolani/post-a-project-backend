import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError,
    PrismaClientUnknownRequestError,
    PrismaClientRustPanicError,
    PrismaClientInitializationError,
    PrismaClientValidationError
 } from '@prisma/client/runtime';

const PRISMA_CLIENT_ERROR_TYPES = {
    PrismaClientKnownRequestError: "Prisma Client throws a PrismaClientKnownRequestError exception if the query engine returns a known error related to the request - for example, a unique constraint violation.",
    PrismaClientUnknownRequestError: "Prisma Client throws a PrismaClientUnknownRequestError exception if the query engine returns an error related to a request that does not have an error code.",
    PrismaClientRustPanicError: "Prisma Client throws a PrismaClientRustPanicError exception if the underlying engine crashes and exits with a non-zero exit code. In this case, the Prisma Client or the whole Node process must be restarted.",
    PrismaClientInitializationError: "Prisma Client throws a PrismaClientInitializationError exception if something goes wrong when the query engine is started and the connection to the database is created.",
    PrismaClientValidationError: "Prisma Client throws a PrismaClientValidationError exception if validation fails. Missing field or type validation error"
}

export const prismaClientErrorType = (err: Error | unknown) => {
    if (err instanceof PrismaClientKnownRequestError){
        return PRISMA_CLIENT_ERROR_TYPES.PrismaClientKnownRequestError
    } else if (err instanceof PrismaClientUnknownRequestError) {
        return PRISMA_CLIENT_ERROR_TYPES.PrismaClientUnknownRequestError
    } else if (err instanceof PrismaClientRustPanicError) {
        return PRISMA_CLIENT_ERROR_TYPES.PrismaClientRustPanicError
    } else if (err instanceof PrismaClientInitializationError) {
        return PRISMA_CLIENT_ERROR_TYPES.PrismaClientInitializationError
    } else {
        return PRISMA_CLIENT_ERROR_TYPES.PrismaClientValidationError
    }
}


