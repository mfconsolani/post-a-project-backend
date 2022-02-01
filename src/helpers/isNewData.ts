import Logger from '../middlewares/winstonLoggerMiddleware';
import { Request } from 'express';
export const isNewData = async (req:Request, callback:CallableFunction) => {
    const { body } = req
    const getCurrentRecords = await callback(body)
    // console.log(getCurrentRecords)
    //@ts-ignore
    //Return array from data records in DB and sort
    const valuesFromDB = Object.entries(getCurrentRecords).sort()
    //Return array from values incoming from requests and sort
    const valuesFromRequest = Object.entries(body).sort()
    //Filter only the key-value pairs from the DB query that match the key-value pairs requested to be updated
    const fieldsToCompare = valuesFromDB.filter((elem, i) => Object.keys(body).includes(elem[0]))

    // Uncomment loggers for debugging purposes
    // Logger.info("Fields to compare --> " + Object.values(fieldsToCompare).map(el => el[0]))
    // Logger.info("Current values in DB --> " + fieldsToCompare)
    // Logger.info("Incoming values from request --> " + valuesFromRequest)

    //Compare incoming values from request vs data currently in DB
    const isUpdateRequired = () => {
        const newValues = {}
        //@ts-ignore
        valuesFromRequest.map((elem, i) => {
            if (elem[1] !== fieldsToCompare[i][1]) {
                // Logger.info("New value --> " + elem[1] + "  |----|  " + "Old value --> " + fieldsToCompare[i][1])
                Object.assign(newValues, { [elem[0]]: elem[1] })
            } else {
                return false
            }
        })
        return Object.keys(newValues).length > 0 ? { isNewData: true, newValues } : { isNewData: false }
    }
    return isUpdateRequired()
}