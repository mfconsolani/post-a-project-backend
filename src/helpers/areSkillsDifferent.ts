const flattenSkillsArray = (requestData:any, databaseData:any) => {
    // console.log("flattening skills", requestData, databaseData)
    const requestSkills = requestData.map((elem:any) => {
        // console.log(elem)
        // return elem.skill
        return elem
    })
    // //@ts-ignore
    const databaseSkills = databaseData.map((elem:any) => {
        // console.log('logging database skills', elem.skill)
        return elem.skill
    })
    // console.log("{requestSkills, databaseSkills}", {requestSkills, databaseSkills})
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
        // console.log("diff in skills from req", arrays.requestSkills.filter((elem:any) => !arrays.databaseSkills.includes(elem)))
        // differenceInSkills.push(arrays.databaseSkills.filter((elem:any) => !arrays.requestSkills.includes(elem)))
        // console.log("diff in skills from db", arrays.databaseSkills.filter((elem:any) => !arrays.requestSkills.includes(elem)))
        // console.log({difference: true, skills: differenceInSkills.flat()})
        return {difference: true, skills: differenceInSkills.flat()}
    } else {
        // console.log({difference: false, skills: differenceInSkills.flat()})
        return {difference: false, skills: differenceInSkills.flat()}
    }
}
