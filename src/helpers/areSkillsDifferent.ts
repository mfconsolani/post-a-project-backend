

const flattenSkillsArray = (requestData:any, databaseData:any) => {
    const requestSkills = requestData.map((elem:any) => {
        return elem.skill
    })
    // //@ts-ignore
    const databaseSkills = databaseData.map((elem:any) => {
        return elem.skill
    })
    return {requestSkills, databaseSkills}
}


export const areSkillsDifferent = (requestData:any, databaseData:any) => {
    const arrays = flattenSkillsArray(requestData, databaseData)
    arrays.requestSkills.filter((elem:any) => {
        return !arrays.databaseSkills.includes(elem)
    } )
    let differenceInSkills:any = []
    if (arrays.requestSkills.filter((elem:any) => !arrays.databaseSkills.includes(elem)).length > 0 ||
       arrays.databaseSkills.filter((elem:any) => !arrays.requestSkills.includes(elem)).length > 0){
        differenceInSkills.push(arrays.requestSkills.filter((elem:any) => !arrays.databaseSkills.includes(elem)))
        differenceInSkills.push(arrays.databaseSkills.filter((elem:any) => !arrays.requestSkills.includes(elem)))
        return {difference: true, skills: differenceInSkills.flat()}
    } else {
        return {difference: false, skills: differenceInSkills.flat()}
    }
}
