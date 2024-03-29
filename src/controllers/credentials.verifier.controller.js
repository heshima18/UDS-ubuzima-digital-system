import query from "./query.controller";

export async function checkEmail(needle,table) {
    let q = await query(`select email,phone from ${table} where email = ?`, [needle])
    return q
}
export async function checkPhone(needle,table) {
    let q = await query(`select email,phone from ${table} where phone = ?`, [needle])
    return q
}
export async function checkNID(needle,table) {
    let q = await query(`select email,phone from ${table} where nid = ?`, [needle])
    return q
}
export async function checku_name(needle,table) {
    let q = await query(`select email,phone from ${table} where username = ?`, [needle])
    return q
}
export async function checkHouseHolder(needle) {
    let q = await query(`select id,assurances from patients where nid = ?  AND role = 'householder'`, [needle])
    if (q.length) {
        q[0].assurances = JSON.parse(q[0].assurances)
    }
    return q
}
export async function checkObjectAvai(table, column, key, needle,entity, entityId) {
    let q = await query(`SELECT id FROM ${table} where JSON_CONTAINS(${column}, JSON_OBJECT(?, ?), '$') AND ${entity} = ?`,[key,needle,entityId])
    return q
}
export async function checkArrayAvai(table, column, needle,entity, entityId) {
    let q = await query(`SELECT id FROM ${table} where JSON_CONTAINS(${column}, JSON_QUOTE(?), '$') AND ${entity} = ?`,[needle,entityId])
    return q
}
export async function getSession(sessionid) {
    let q = await query(`select id,hc_provider,patient,hospital,status from medical_history where id = ?`,[sessionid])
    if (!q) {
        return undefined
    }
    return q
}
export async function getRelatives(userid) {
    let q = await query(`select patients.id from patients where householder = ? OR householder = (select householder from patients where id = ?) and id != ?`,[userid,userid,userid])
    if (!q) {
        return undefined
    }
    q = q.map(e=>{
        return e.id
    })
    return q
}
export async function getMessage(messageid) {
    let q = await query(`select id,sessionid,user,receiver,status from messages where id = ?`,[messageid])
    if (!q) {
        return undefined
    }
    return q
}
export async function getTest(testid) {
    let q = await query(`select id,type,department,reqSecAuth,reqPatiAuth from tests where id = ?`,[testid])
    if (!q) {
        return undefined
    }
    return q
}
export async function getOperation(opid) {
    let q = await query(`select id,department,reqSecAuth,reqPatiAuth from operations where id = ?`,[opid])
    if (!q) {
        return undefined
    }
    return q
}
export async function getPayment(sessionid) {
    let q = await query(`select id,assurance_amount,amount from payments where session = ?`,[sessionid])
    if (!q) {
        return undefined
    }
    return q
}