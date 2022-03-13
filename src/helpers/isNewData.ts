import Logger from '../middlewares/winstonLoggerMiddleware';
import { Request } from 'express';
import { areSkillsDifferent } from './areSkillsDifferent';

//TODO
//Add a validation to check if length of request object and length of info in DB is the same
//Add a validation step to check if the corresponding field keys are equal or not
//Implement the same logic for roles as in with skills to check if update is required and update it if
//it comes to it
//First if block in IsUpdateRequired function should be erased as the skills/roles array from the
//request should never arrive empy

export const isNewData = async (req: Request, callback: CallableFunction, skillsFromReq?: any, skillsFromDb?: any) => {
    const { body } = req
    const getCurrentRecords = await callback(body)
    // console.log(body)
    // console.log(getCurrentRecords)

    //@ts-ignore
    //Return array from data records in DB and sort
    const valuesFromDB = Object.entries(getCurrentRecords).sort()
    // console.log(valuesFromDB)
    //Return array from values incoming from requests and sort
    const valuesFromRequest = Object.entries(body).sort()
    // console.log(valuesFromRequest)
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
            // console.log("skills in request", body.skill)
            // console.log("skills in db", getCurrentRecords.skill)
            if (body.skill.length === 0 
                && elem[0] === "skill" 
                && getCurrentRecords.skill.length !== 0) {
                    // console.log("inside first if")
                Object.assign(newValues, { skills: areSkillsDifferent(valuesFromRequest, valuesFromDB).skills })
            } else if (elem[0] === "skill" && elem[0].length > 0) {
                // console.log("inside first else if")
                areSkillsDifferent(body.skill, getCurrentRecords.skill).skills.length > 0 
                && Object.assign(newValues, { skills: areSkillsDifferent(body.skill, getCurrentRecords.skill).skills })
            } else if (elem[1] !== fieldsToCompare[i][1]) {
                // Logger.info("New value --> " + elem[1] + "  |----|  " + "Old value --> " + fieldsToCompare[i][1])
                Object.assign(newValues, { [elem[0]]: elem[1] })
            } else {
                return false
            }
        })
        // console.log("newValues: ", newValues)
        return Object.keys(newValues).length > 0 ? { isNewData: true, newValues } : { isNewData: false }
    }
    return isUpdateRequired()
}