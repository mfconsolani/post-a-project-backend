import { Prisma } from '@prisma/client';

interface prsimaError {
    [errorName: string]: string
}

const PRISMA_CLIENT_ERROR_TYPES: prsimaError = {
    PrismaClientKnownRequestError: "Error related to the request - for example, a unique constraint violation.",
    PrismaClientUnknownRequestError: "Error related to a request that is not indexed by the query engine",
    PrismaClientRustPanicError: "Error thrown when the underlying engine crashes and exits with a non-zero exit code. Service must be restarted.",
    PrismaClientInitializationError: "Something went wrong when the query engine was started and the connection to the database was created.",
    PrismaClientValidationError: "Validation failure. Missing field or type validation error"
}

const prismaClientErrorType = (err: Error | unknown): prsimaError | Error => {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return {PrismaClientKnownRequestError: PRISMA_CLIENT_ERROR_TYPES.PrismaClientKnownRequestError}
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        return {PrismaClientUnknownRequestError: PRISMA_CLIENT_ERROR_TYPES.PrismaClientUnknownRequestError }
    } else if (err instanceof Prisma.PrismaClientRustPanicError) {
        return {PrismaClientRustPanicError: PRISMA_CLIENT_ERROR_TYPES.PrismaClientRustPanicError}
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        return {PrismaClientInitializationError: PRISMA_CLIENT_ERROR_TYPES.PrismaClientInitializationError}
    } else if (err instanceof Prisma.PrismaClientValidationError) {
        return {PrismaClientValidationError: PRISMA_CLIENT_ERROR_TYPES.PrismaClientValidationError}
    } else {
        return new Error("Unknown error on query engine")
    }
}


export default prismaClientErrorType;