import Logger from '../middlewares/winstonLoggerMiddleware';
import { prisma } from '../db';
import { Request, Response } from 'express';


const isNewData = async (req: Request) => {
    let { body } = req
    Logger.debug("Line 8")
    const getCurrentRecords = await prisma.project.findUnique({
        where: {
            id: parseInt(req.params.id)
        },
        include: {
            role: true,
            skill: true
        }
    })
    Logger.debug("Line 18")
    console.log(body)


    //@ts-ignore
    const valuesFromDB = Object.entries(getCurrentRecords).sort()
    Logger.debug("Line 23")
    const valuesFromRequest = Object.entries(body).sort()
    console.log(valuesFromRequest)
    Logger.debug("Line 25")
    let fieldsToCompare = valuesFromDB.filter((elem, i) => Object.keys(body).includes(elem[0]))
    Logger.debug("Line 27")


    Logger.info("Fields to compare --> " + Object.values(fieldsToCompare).map(el => el[0]))
    Logger.info("Current values in DB --> " + fieldsToCompare)
    Logger.info("Incoming values from request --> " + valuesFromRequest)

    const isUpdateRequired = () => {
        const newValues = {}
        //@ts-ignore
        valuesFromRequest.map((elem, i) => {

            if (elem[1] !== fieldsToCompare[i][1]) {
                Logger.info("New value --> " + elem[1] + "  |----|  " + "Old value --> " + fieldsToCompare[i][1])
                Object.assign(newValues, { [elem[0]]: elem[1] })
            } else {
                return false
            }
        })
        Logger.info(newValues)

        return Object.keys(newValues).length > 0 ? {isNewData: true, newValues} : {isNewData: false}
    }

    return isUpdateRequired()
}

export default isNewData;
