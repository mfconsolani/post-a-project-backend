import Logger from '../middlewares/winstonLoggerMiddleware';
import { Request } from 'express';
import { areSkillsDifferent } from './areSkillsDifferent';

//TODO
//Add a validation to check if length of request object and length of info in DB is the same
//Add a validation step to check if the corresponding field keys are equal or not

export const isNewData = async (req:Request, callback:CallableFunction, skillsFromReq?:any, skillsFromDb?:any) => {
    const { body } = req
    // console.log(body)
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
            if (skillsFromReq.length === 0 && elem[0] === "skills" && skillsFromDb.length !== 0){ 
                // console.log("skills from request empty")
                Object.assign(newValues, {skills: areSkillsDifferent(skillsFromReq, skillsFromDb).skills})
            } else if (elem[0] === "skills" && elem[0].length > 0){
                // console.log("skills from db", skillsFromDb)
                // console.log("elem[0].length", elem[0].length)
                // console.log("skillsFromReq.length", skillsFromReq.length)
                // console.log("elem[0]", elem)
                // console.log("Are skills different:", areSkillsDifferent(skillsFromReq, skillsFromDb).skills)
                areSkillsDifferent(skillsFromReq, skillsFromDb).skills.length > 0 && Object.assign(newValues, {skills: areSkillsDifferent(skillsFromReq, skillsFromDb).skills})
            } else if (elem[1] !== fieldsToCompare[i][1]) {
                Logger.info("New value --> " + elem[1] + "  |----|  " + "Old value --> " + fieldsToCompare[i][1])
                Object.assign(newValues, { [elem[0]]: elem[1] })
            } else {
                return false
            }
        })
        console.log("newValues: ", newValues)
        return Object.keys(newValues).length > 0 ? { isNewData: true, newValues } : { isNewData: false }
    }
    return isUpdateRequired()
}