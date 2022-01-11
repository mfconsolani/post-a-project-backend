import { Prisma } from '@prisma/client';

const PRISMA_CLIENT_ERROR_TYPES = {
    PrismaClientKnownRequestError: "Error related to the request - for example, a unique constraint violation.",
    PrismaClientUnknownRequestError: "Error related to a request that is not indexed by the query engine",
    PrismaClientRustPanicError: "Error thrown when the underlying engine crashes and exits with a non-zero exit code. Service must be restarted.",
    PrismaClientInitializationError: "Something went wrong when the query engine was started and the connection to the database was created.",
    PrismaClientValidationError: "Validation failure. Missing field or type validation error"
}

export const prismaClientErrorType = (err: Error | unknown) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return PRISMA_CLIENT_ERROR_TYPES.PrismaClientKnownRequestError
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        return PRISMA_CLIENT_ERROR_TYPES.PrismaClientUnknownRequestError
    } else if (err instanceof Prisma.PrismaClientRustPanicError) {
        return PRISMA_CLIENT_ERROR_TYPES.PrismaClientRustPanicError
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        return PRISMA_CLIENT_ERROR_TYPES.PrismaClientInitializationError
    } else {
        return PRISMA_CLIENT_ERROR_TYPES.PrismaClientValidationError
    }
}


